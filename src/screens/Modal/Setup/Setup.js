import { UserAddOutlined } from '@ant-design/icons';
import { Input } from 'antd';
import React, { useState } from 'react';

export const Setup = (props) => {
  const { tokenHook, templateIDHook, nameHook } = props;
  const [token, setToken] = tokenHook
  const [templateID, setTemplateID] = templateIDHook
  const [name, setName] = nameHook

  return(
    <>
      <h3>Enter the persons name who the pdf is describing</h3>
      <Input value={name} onChange={(event) => setName(event.target.value)} size="large" placeholder="John Higgins" />
      <h3>Enter a template ID</h3>
      <Input value={templateID} onChange={(event) => setTemplateID(event.target.value)} size="large" placeholder="35A8E8B5-3CC2-43CF-B4DB-F8E139031518" />
      <h3>Enter API Secret Key</h3>
      <p>This can be found within the <a href='https://dashboard.pdfmonkey.io/account'>My account</a> page  </p>
      <Input value={token} onChange={(event) => setToken(event.target.value)} size="large" placeholder="QTGG_FQherTUYV3cDYyx" />

    </>
  )
};
