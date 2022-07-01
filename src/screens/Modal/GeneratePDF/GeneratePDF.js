import React, { useState } from 'react';
import { Button } from 'antd';
import axios from 'axios';
import { createPublishRequest, createRequest } from '../../../util/util';
// import output from "../../../output.json";

export function GeneratePDF(props) {
  const {
    nameHook,
    titleHook,
    bioHook,
    eduHook,
    expHook,
    skillsHook,
    documentIDHook,
    templateIDHook,
    tokenHook,
    documentPersonNameHook
  } = props;
  const [name] = nameHook;
  const [title] = titleHook;
  const [bio] = bioHook;
  const [edu] = eduHook;
  const [exp] = expHook;
  const [skills] = skillsHook;
  const [documentID] = documentIDHook;
  const [templateID] = templateIDHook
  const [token] = tokenHook
  const [documentPersonName] = documentPersonNameHook

  const [previewURL, setPreviewURL] = useState('');
  const [updateTime, setUpdateTime] = useState();

  const data = {
    userinfo: {
      name: name,
      title: title,
      funfact: bio,
    },
    education: edu,
    experience: exp,
    skills1: skills,
  };

  const requestPDFOnClick = async () => {
    // axios.get(`https://api.pdfmonkey.io/api/v1/documents/${documentID}`, {
    // pessimistic update time (time is less than any future update and greater than any past updates)
    // used to determine if the download has been updated yet
    const dateNow = new Date();
    setUpdateTime(dateNow.toISOString());
    axios
      .put(
        `https://api.pdfmonkey.io/api/v1/documents/7BCC76B7-4BF8-4CCC-B27C-341003204194`,
        createRequest(data),
        headerInfo
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
        `https://api.pdfmonkey.io/api/v1/documents/7BCC76B7-4BF8-4CCC-B27C-341003204194`,
        createPublishRequest(),
        headerInfo
      )
      .then((result) => {
        const lastGenerationLog = result.data.document.generation_logs.at(-1);
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
          <Button onClick={requestPDFOnClick}>Update PDF</Button>
          <Button onClick={createDownloadLink}>Download PDF</Button>
        </>
      )}
    </div>
  );
}
