import React, { useState } from 'react';
import { Field } from '../components/Fields/Field';
import { ArrayField } from '../components/Fields/ArrayField';
import { templateStructure } from '../templateStructure';
import { useRecoilValue } from 'recoil';
import { sectionStateHook } from '../util/Atoms';
const createSectionFields = (schema, sectionTitle) => {
  return Object.keys(schema).map((fieldName) => {
    const field = schema[fieldName];
    if (Array.isArray(field))
      return <ArrayField sectionTitle={sectionTitle} title={fieldName} templateItem={field[0]} />;
    else return <Field sectionTitle={sectionTitle} title={fieldName} />;
  });
};

const createSections = (templateStructure) => {
  return Object.keys(templateStructure).map((sectionTitle) => {
    const section = templateStructure[sectionTitle];
    // create sections here
    switch (section.type) {
      case 'Autofill':
      case 'ShowData':
      case 'Transfer':
      default:
        return <div>{createSectionFields(section.schema, sectionTitle)}</div>;
    }
  });
};

export const Test = () => {
  const section = useRecoilValue(sectionStateHook)

  return <>
    {JSON.stringify(section)}
    {createSections(templateStructure)}
  </>;
};
