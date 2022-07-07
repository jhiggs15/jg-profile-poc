import React, { useState, useEffect } from 'react';
import './style.css';

import { Layout, Button } from 'antd';
import { CreateProfile } from './screens/CreateProfile/CreateProfile';
import {
  RecoilRoot,
} from 'recoil';

export default function App() {

  return (
    <RecoilRoot> 
      <Layout style={{ padding: 20 }}>
        <CreateProfile />
      </Layout>
    </RecoilRoot>

  );
}
