import React, { useState } from 'react';
import { Button } from 'antd';
import axios from 'axios';
import {
  createPublishRequest,
  createRequest,
  createHeaderInfo,
} from '../../util/PDFMonkeyUtil';
// import output from "../../../output.json";

export function GeneratePDF(props) {
  const {
    sectionStateHook,
    tokenHook,
    templateIDHook,
    documentIDHook,
    documentPersonNameHook,
    previewURLHook,
  } = props;
  const [sectionState] = sectionStateHook;
  const [documentID] = documentIDHook;
  const [templateID] = templateIDHook;
  const [token] = tokenHook;
  const [documentPersonName] = documentPersonNameHook;

  const [isLoading, setIsLoadng] = useState(false)
  const [previewURL, setPreviewURL] = previewURLHook;
  const [updateTime, setUpdateTime] = useState();

  const requestPDFOnClick = async () => {
    // axios.get(`https://api.pdfmonkey.io/api/v1/documents/${documentID}`, {
    // pessimistic update time (time is less than any future update and greater than any past updates)
    // used to determine if the download has been updated yet
    const dateNow = new Date();
    setUpdateTime(dateNow.toISOString());
    axios
      .put(
        `https://api.pdfmonkey.io/api/v1/documents/${documentID}`,
        createRequest(sectionState),
        createHeaderInfo(token)
      )
      .then((result) => {
        setPreviewURL(result.data.document.preview_url);
      })
      .catch((error) => {
        console.error(error);
      });
  };

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
        const lastGenerationLog = result.data.document.generation_logs.at(-1) ?? {timestamp: 0};
        if (new Date(updateTime) <= new Date(lastGenerationLog.timestamp))
          window.open(result.data.document.download_url);
        else {
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
    <div>
      <h1>Output</h1>
      {previewURL === '' ? (
        <>
          <Button onClick={requestPDFOnClick}>Create PDF</Button>
        </>
      ) : (
        <>
          <iframe src={previewURL} />
          {isLoading ?
            <p>Loading...</p>
            :
            <> 
              <Button onClick={requestPDFOnClick}>Update PDF</Button>
              <Button onClick={createDownloadLink}>Download PDF</Button>
            </>
          }

        </>
      )}
    </div>
  );
}
