import axios from 'axios';
import { templateInfo, headerInfo } from '../util/util';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "antd";

export const CreateDocument = (props) => {
  const { documentIDHook } = props;
  const [, setDocumentID] = documentIDHook;
  const navigate = useNavigate();

  const createDocument = () => {
    navigate('/info');

    // axios
    //   .post('https://api.pdfmonkey.io/api/v1/documents', templateInfo, {
    //     headers: headerInfo,
    //   })
    //   .then((result) => {
    //     setDocumentID(result.data.document.id);
    //     navigate('/info');
    //   })
    //   .catch((error) => {
    //     console.error(error);
    //   });
  }

  // TODO this is where query options would be loaded
  // could be good to do a popup
  return( 
    <Button onClick={createDocument} > 
      Start Profile Generation

    </Button>
  )
};
