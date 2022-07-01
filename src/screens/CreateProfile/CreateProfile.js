import React, { useState } from 'react';
import { BasicInfo } from '../../components/BasicInfo';
import { Education } from '../../components/Education';
import { Skills } from '../../components/Skills';
import { Experience } from '../../components/Experience';
import { Output } from '../../components/Output';
import { Setup } from '../Modal/Setup/Setup';
import { Button, Modal, Layout, Steps } from 'antd';

import { ScissorOutlined } from '@ant-design/icons';
import { inputData } from '../../inputData';
import { ChooseDataForTemplate } from '../Modal/ChooseDataForTemplate/ChooseDataForTemplate';
import { GeneratePDF } from '../Modal/GeneratePDF/GeneratePDF';
import { templateInfo } from '../../util/util';


const createDraftDocument = () => {
  axios
    .post('https://api.pdfmonkey.io/api/v1/documents', templateInfo(), {
      headers: headerInfo,
    })
    .then((result) => {
      setDocumentID(result.data.document.id);
      navigate('/info');
    })
    .catch((error) => {
      console.error(error);
    });
}



export const CreateProfile = (props) => {
    const documentPersonNameHook = useState()
    const nameHook = useState(inputData.name);
    const titleHook = useState(inputData.tense_title);
    const bioHook = useState(inputData.biography);
    const eduHook = useState({});
    const expHook = useState([]);
    const skillsHook = useState([]);
    const tokenHook = useState("");
    const templateIDHook = useState("");
    const documentIDHook = useState('');

    const [visible, setVisible] = useState(false);
    const [stepValue, setStepValue]  = useState(0);

    const renderStep = () => {
        const steps = [
        <Setup tokenHook={tokenHook} templateIDHook={templateIDHook} nameHook={documentPersonNameHook} />,
        <ChooseDataForTemplate />,
        <GeneratePDF 
            nameHook={nameHook}
            titleHook={titleHook}
            bioHook={bioHook}
            eduHook={eduHook}
            expHook={expHook}
            skillsHook={skillsHook}
            tokenHook={tokenHook}
            templateIDHook={templateIDHook}
            documentIDHook={documentIDHook}
            documentPersonNameHook={documentPersonNameHook}
         />,
        ];
  
        return (
        <>
            {steps[stepValue]}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            {stepValue != 0 ? (
                <Button 
                  onClick={() => {
                    setStepValue(stepValue - 1)
                    
                  }}
                >
                    Back
                </Button>
            ) : null}
            {stepValue < 2 ? (
                <Button 
                onClick={() => {
                  // if(stepValue == 0) {
                  //   createDraftDocument()
                  // }
                  setStepValue(stepValue + 1)
                  
                }}
                >
                  Next 
                </Button>
            ) : (
                <Button> Download PDF </Button>
            )}
            </div>
        </>
        );
  };




  return (
    <>
      <Button onClick={() => setVisible(true)}>Create a PDF</Button>
      <Modal
        width={'auto'}
        bodyStyle={{ height: '70vh', overflow: 'scroll' }}
        visible={visible}
        footer={null}
        title={
          <div
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <h1> Create a PDF </h1>
            <Steps
              current={stepValue}
              style={{ justifyContent: 'center' }}
            >
              <Steps.Step
                title="Choose a Template"
                icon={<ScissorOutlined />}
              />
              <Steps.Step
                title="Select Data for Template"
                icon={<ScissorOutlined />}
              />
              <Steps.Step title="Generate PDF" icon={<ScissorOutlined />} />
            </Steps>
          </div>
        }
        onCancel={() => setVisible(false)}
      >
        {renderStep(stepValue)}
        {/* <BasicInfo
          nameHook={nameHook}
          titleHook={titleHook}
          bioHook={bioHook}
        />
        <Education eduHook={eduHook} />
        <Skills skillsHook={skillsHook} />
        <Experience expHook={expHook} />
        <Output
          nameHook={nameHook}
          titleHook={titleHook}
          bioHook={bioHook}
          eduHook={eduHook}
          expHook={expHook}
          skillsHook={skillsHook}
          documentIDHook={documentIDHook}
        /> */}
      </Modal>
    </>
  );
};
