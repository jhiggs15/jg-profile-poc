import React, { useState, useEffect } from 'react';
import './style.css';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from 'react-router-dom';
import { Layout, Button } from 'antd';
import { Output } from './screens/output/output';
import { UserInfo } from './screens/UserInfo/UserInfo';
import { CreateDocument } from './components/CreateDocument';
import { inputData } from './inputData';

export default function App() {
  const nameHook = useState(inputData.name);
  const titleHook = useState(inputData.tense_title);
  const bioHook = useState(inputData.biography);
  const eduHook = useState({});
  const expHook = useState([]);
  const skillsHook = useState([]);

  const documentIDHook = useState('');

  return (
    <Router>
      <Layout style={{ padding: 20 }}>
        <Routes>
          <Route
            path="/"
            element={
              <UserInfo
                nameHook={nameHook}
                titleHook={titleHook}
                bioHook={bioHook}
                eduHook={eduHook}
                skillsHook={skillsHook}
                expHook={expHook}
                documentIDHook={documentIDHook}
              />
            }
          />
        </Routes>
      </Layout>
    </Router>
  );
}
