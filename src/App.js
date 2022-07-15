import React, { useState, useEffect } from 'react';
import './style.css';

import { Layout, Button } from 'antd';
import { CreateProfile } from './screens/CreateProfile/CreateProfile';
import {
  RecoilRoot,
} from 'recoil';
import { Test } from './screens/test';

export default function App() {

  return (
    <RecoilRoot> 
      <Layout style={{ padding: 20 }}>
        <CreateProfile />
        {/* <Test /> */}
      </Layout>
    </RecoilRoot>

  );
}
