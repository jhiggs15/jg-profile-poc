import React, { useState } from 'react';
import { Setup } from '../Setup/Setup';
import { Button, Steps } from 'antd';

import { ScissorOutlined } from '@ant-design/icons';
import { ChooseDataForTemplate } from '../ChooseDataForTemplate/ChooseDataForTemplate';
import { GeneratePDF } from '../GeneratePDF/GeneratePDF';
import { createTemplateInfo, createHeaderInfo } from '../../util/PDFMonkeyUtil';
import axios from 'axios';
import { tokenHook, templateIDHook } from '../../util/Atoms';
import {
  useRecoilValue,
} from 'recoil';

export const CreateProfile = (props) => {

  const [stepValue, setStepValue] = useState(0);

  const templateID = useRecoilValue(templateIDHook)
  const token = useRecoilValue(tokenHook)

  const createDraftDocument = () => {
    axios
      .post(
        'https://api.pdfmonkey.io/api/v1/documents',
        createTemplateInfo(templateID, 'John'),
        createHeaderInfo(token)
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
      <Setup />,
      <ChooseDataForTemplate />,
      <GeneratePDF />,
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
