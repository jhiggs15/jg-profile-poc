import React, { useState, useEffect } from 'react';
import { Button } from 'antd';
import axios from 'axios';
import {
  createPublishRequest,
  createRequest,
  createHeaderInfo,
} from '../../util/PDFMonkeyUtil';
import { useRecoilValue, useRecoilState } from 'recoil';
import {
  sectionStateHook,
  nameHook,
  tokenHook,
  templateIDHook,
  documentIDHook,
  previewURLHook,
} from '../../util/Atoms';

import { Document } from '../../components/Document/Document.js';

export function GeneratePDF(props) {
  const sectionState = useRecoilValue(sectionStateHook);
  const documentID = useRecoilValue(documentIDHook);
  const templateID = useRecoilValue(templateIDHook);
  const token = useRecoilValue(tokenHook);
  const name = useRecoilValue(nameHook);
  const [previewURL, setPreviewURL] = useRecoilState(previewURLHook);

  const [isLoading, setLoading] = useState(true);
  const [updateTime, setUpdateTime] = useState();

  useEffect(() => {
    // pessimistic update time (time is less than any future update and greater than any past updates)
    // used to determine if the download has been updated yet
    const dateNow = new Date();
    setUpdateTime(dateNow.toISOString());
    setLoading(true);
    axios
      .put(
        `https://api.pdfmonkey.io/api/v1/documents/${documentID}`,
        createRequest(sectionState),
        createHeaderInfo(token)
      )
      .then((result) => {
        setPreviewURL(result.data.document.preview_url);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  // sets document status to pending which triggers the download_url to be created
  // Based on the generation logs we can tell if the document has been updated
  const createDownloadLink = async () => {
    // axios.get(`https://api.pdfmonkey.io/api/v1/documents/${documentID}`, {
    axios
      .put(
        `https://api.pdfmonkey.io/api/v1/documents/${documentID}`,
        createPublishRequest(),
        createHeaderInfo(token)
      )
      .then((result) => {
        setLoading(true);
        // take another look at returning 0
        const lastGenerationLog = result.data.document.generation_logs.at(
          -1
        ) ?? { timestamp: 0 };
        if (new Date(updateTime) <= new Date(lastGenerationLog.timestamp)) {
          window.open(result.data.document.download_url);
          setLoading(false);
        } else {
          setTimeout(() => {
            createDownloadLink();
          }, 2000);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div style={{ height: '100%' }}>
      {isLoading ? (
        <h1> Loading</h1>
      ) : (
        <>
          <Button onClick={createDownloadLink}>Download PDF</Button>
          <Document previewURL={previewURL} />
        </>
      )}
    </div>
  );
}
