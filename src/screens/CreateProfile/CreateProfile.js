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
import { createTemplateInfo, createHeaderInfo } from '../../util/util';
import axios from 'axios';

export const CreateProfile = (props) => {
  const sectionStateHook = useState({});
  const documentPersonNameHook = useState();
  const tokenHook = useState('');
  const templateIDHook = useState('');
  const documentIDHook = useState('');
  const previewURLHook = useState('');

  const [stepValue, setStepValue] = useState(0);

  const createDraftDocument = () => {
    axios
      .post(
        'https://api.pdfmonkey.io/api/v1/documents',
        createTemplateInfo(templateIDHook[0], 'John'),
        createHeaderInfo(tokenHook[0])
      )
      .then((result) => {
        documentIDHook[1](result.data.document.id);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const renderStep = () => {
    const steps = [
      <Setup
        tokenHook={tokenHook}
        templateIDHook={templateIDHook}
        nameHook={documentPersonNameHook}
      />,
      <ChooseDataForTemplate sectionStateHook={sectionStateHook} />,
      <GeneratePDF
        sectionStateHook={sectionStateHook}
        tokenHook={tokenHook}
        templateIDHook={templateIDHook}
        documentIDHook={documentIDHook}
        documentPersonNameHook={documentPersonNameHook}
        previewURLHook={previewURLHook}
      />,
    ];

    return (
      <>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {stepValue != 0 ? (
            <Button
              onClick={() => {
                setStepValue(stepValue - 1);
              }}
            >
              Back
            </Button>
          ) : null}
          {stepValue < 2 ? (
            <Button
              onClick={() => {
                if (stepValue == 0) {
                  createDraftDocument();
                }
                setStepValue(stepValue + 1);
              }}
            >
              Next
            </Button>
          ) : null}
        </div>
        {steps[stepValue]}
      </>
    );
  };

  return (
    <>
      <div
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column',
          height: '10vh',
        }}
      >
        <Steps current={stepValue} style={{ justifyContent: 'center' }}>
          <Steps.Step title="Choose a Template" icon={<ScissorOutlined />} />
          <Steps.Step
            title="Select Data for Template"
            icon={<ScissorOutlined />}
          />
          <Steps.Step title="Generate PDF" icon={<ScissorOutlined />} />
        </Steps>
      </div>
      <div style={{ height: '90vh' }}>{renderStep(stepValue)}</div>
    </>
  );
};
