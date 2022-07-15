import React, { useState } from 'react';
import { Setup } from '../Setup/Setup';
import { Button, Steps } from 'antd';

import { ScissorOutlined } from '@ant-design/icons';
import { ChooseDataForTemplate } from '../ChooseDataForTemplate/ChooseDataForTemplate';
import { Test } from '../test.js';
import { GeneratePDF } from '../GeneratePDF/GeneratePDF';
import { createTemplateInfo, createHeaderInfo } from '../../util/PDFMonkeyUtil';
import axios from 'axios';
import { tokenHook, templateIDHook, treeHook, sectionStateHook, inputDataHook } from '../../util/Atoms';
import { useRecoilValue, useRecoilState } from 'recoil';
import { Section } from '../../components/Sections/Section';
import { ShowDataSection } from '../../components/Sections/ShowDataSection';
import { TransferSection } from '../../components/Sections/TransferSection';
import { templateStructure } from '../../templateStructure';
import { SkillsDisplay } from '../../components/Data/SkillsDisplay';
import { pathToJSON } from '../../util/toJSON';

const createSections = (templateStructure, inputData) => {
  return Object.keys(templateStructure).map((sectionTitle) => {
    const section = templateStructure[sectionTitle];
    // create sections here
    switch (section.type) {
      case 'Section':
        return (
          <Section title={sectionTitle} schema={section.schema} />
        )
      case 'ShowData':
       return <ShowDataSection title={sectionTitle} schema={section.schema} pathsToDisplay={section.options.show} />
      case 'Transfer':
       return <TransferSection title={sectionTitle} schema={section.schema} transfer={section.options.transfer} />
      case 'Skills':
        const skillData = section.options.skillData
        const allSkills = pathToJSON(skillData.allSkills.path, inputData)
        const JGSkills = pathToJSON(skillData.JGProjectSkills.path, inputData)
        const prevWorkSkills = pathToJSON(skillData.prevWorkSkills.path, inputData)
        return (
          <SkillsDisplay allSkills={allSkills} sectionItemKey={section.options.schemaItemKey} sectionTitle={sectionTitle} title={Object.keys(section.schema)[0]} 
            JGProjects={{companyName: skillData.JGProjectSkills.companyName, skills: skillData.JGProjectSkills.skills, data: JGSkills}} 
            prevWork={{companyName: skillData.prevWorkSkills.companyName, skills: skillData.prevWorkSkills.skills, data: prevWorkSkills}} 
          />
        )
      default:
    }
  });
 };


export const CreateProfile = (props) => {
  const [stepValue, setStepValue] = useState(0);
  const [selectDataStatus, setSelectDataStatus] = useState('process');

  const templateID = useRecoilValue(templateIDHook);
  const inputData = useRecoilValue(inputDataHook);
  const section = useRecoilValue(sectionStateHook);
  const token = useRecoilValue(tokenHook);
  const tree = useRecoilValue(treeHook);
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

  const dataSections = createSections(templateStructure, inputData)

  const renderStep = () => {
    const steps = [
      // <Setup />,
      ...dataSections,
      <GeneratePDF />,
    ];

    const decrementStep = () => {
      if(stepValue + 1 != steps.length - 1) setSelectDataStatus('process')

      setStepValue(stepValue - 1);
    };

    //
    const incrementStep = () => {
      if(stepValue + 1 == steps.length - 1) setSelectDataStatus('finish')
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
        <Steps style={{ justifyContent: 'center' }}>
          <Steps.Step status={selectDataStatus}
            title="Select Data for Template"
            icon={<ScissorOutlined />}
          />
          <Steps.Step status={selectDataStatus == 'process' ? 'wait' : 'process'} title="Generate PDF" icon={<ScissorOutlined />} />
        </Steps>
      </div>
      <div style={{ height: '90vh' }}>{renderStep(stepValue)}</div>
    </>
  );
};
