import React, { useState, useEffect } from 'react';
import './style.css';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from 'react-router-dom';
import { Layout, Button } from 'antd';
import { inputData } from './inputData';
import { CreateProfile } from './screens/CreateProfile/CreateProfile';

export default function App() {

  return (
    <Layout style={{ padding: 20 }}>
      <CreateProfile />
    </Layout>
  );
}
