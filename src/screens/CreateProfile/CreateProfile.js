import React, { useState } from 'react';
import { Setup } from '../Setup/Setup';
import { Button, Steps } from 'antd';

import { ScissorOutlined } from '@ant-design/icons';
import { ChooseDataForTemplate } from '../ChooseDataForTemplate/ChooseDataForTemplate';
import { GeneratePDF } from '../GeneratePDF/GeneratePDF';
import { createTemplateInfo, createHeaderInfo } from '../../util/PDFMonkeyUtil';
import axios from 'axios';
import { tokenHook, templateIDHook, treeHook } from '../../util/Atoms';
import { useRecoilValue, useRecoilState } from 'recoil';

const createSections = (schema) => {
  if (typeof schema == 'undefined') return;
  if (!Array.isArray(schema)) schema = [schema];
  return schema.map((item, index) => {
    if (item.type == 'ArraySection') {
      return (
        <ArraySection
          title={item.title}
          schema={{ ...item.children[0] }}
          children={getSection(item.title) ?? []}
          handleFieldChange={handleFieldChange}
          getItem={getField}
          addArrayItem={addArrayItem}
          removeArrayItem={removeArrayItem}
          index={index}
          draggedJSONNode={draggedJSONNode}
          triggerPopup={triggerPopup}
        />
      );
    } else if (item.type == 'ParentSection') {
      return (
        <ParentSection
          title={item.title}
          children={item.children}
          handleFieldChange={handleFieldChange}
          getItem={getField}
          index={index}
          draggedJSONNode={draggedJSONNode}
          triggerPopup={triggerPopup}
        />
      );
    }
  });
};

export const CreateProfile = (props) => {
  const [stepValue, setStepValue] = useState(0);
  const [currentDataSection, setCurrentDataSection] = useState('');
  const templateID = useRecoilValue(templateIDHook);
  const token = useRecoilValue(tokenHook);
  const tree = useRecoilValue(treeHook);
  console.log(tree)
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
      // <Setup />,
      <ChooseDataForTemplate />,
      <GeneratePDF />,
    ];

    const decrementStep = () => {
      setStepValue(stepValue - 1);
    };

    //
    const incrementStep = () => {
      // if (stepValue == 0) createDraftDocument();
      setStepValue(stepValue + 1);
    };

    return (
      <>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button disabled={stepValue == 0} onClick={decrementStep}>
            Back
          </Button>
          <Button
            disabled={stepValue == steps.length - 1}
            onClick={incrementStep}
          >
            Next
          </Button>
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
          {/* <Steps.Step title="Choose a Template" icon={<ScissorOutlined />} /> */}
          <Steps.Step
            title="Select Data for Template"
            description={currentDataSection}
            icon={<ScissorOutlined />}
          />
          <Steps.Step title="Generate PDF" icon={<ScissorOutlined />} />
        </Steps>
      </div>
      <div style={{ height: '90vh' }}>{renderStep(stepValue)}</div>
    </>
  );
};
