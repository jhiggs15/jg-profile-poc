import React, { useState } from 'react';
import { BasicInfo } from '../../components/BasicInfo';
import { Education } from '../../components/Education';
import { Skills } from '../../components/Skills';
import { Experience } from '../../components/Experience';
import { Output } from '../../components/Output';
import { ChooseTemplate } from '../../screens/ChooseTemplate/ChooseTemplate';
// import { ChooseDataForTemplate } from '../../screens/ChooseDataForTemplate/ChooseDataForTemplate';
// import { GeneratePDF } from '../../screens/GeneratePDF/GeneratePDF';
import { Button, Modal, Layout, Steps } from 'antd';
import './UserInfo.css';

import { ScissorOutlined } from '@ant-design/icons';

const renderStep = (stepValueHook) => {
  const [stepValue, setStepValue] = stepValueHook;
  const steps = [
    <ChooseTemplate />,
    // <ChooseDataForTemplate />,
    // <GeneratePDF />,
  ];

  return (
    <>
      {steps[stepValue]}
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        {stepValue != 0 ? (
          <Button onClick={() => setStepValue(stepValue - 1)}>Back </Button>
        ) : null}
        {stepValue < 2 ? (
          <Button onClick={() => setStepValue(stepValue + 1)}>Next </Button>
        ) : (
          <Button> Download PDF </Button>
        )}
      </div>
    </>
  );
};

export const UserInfo = (props) => {
  const {
    nameHook,
    titleHook,
    bioHook,
    eduHook,
    skillsHook,
    expHook,
    documentIDHook,
  } = props;

  const [visible, setVisible] = useState(false);

  const stepValueHook = useState(0);

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
              current={stepValueHook[0]}
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
        {renderStep(stepValueHook)}
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
