import React, { useState } from 'react';
import { Field } from '../components/Fields/Field';
import { ArrayField } from '../components/Fields/ArrayField';
import { templateStructure } from '../templateStructure';
import { useRecoilValue } from 'recoil';
import { sectionStateHook, treeHook } from '../util/Atoms';
import { Section } from '../components/Sections/Section';
import { TreeDisplay } from '../components/Data/TreeDisplay';
import { ShowDataSection } from '../components/Sections/ShowDataSection';
 
 
const createSections = (templateStructure) => {
 return Object.keys(templateStructure).map((sectionTitle) => {
   const section = templateStructure[sectionTitle];
   // create sections here
   switch (section.type) {
     case 'Section':
      return
      //  return (
      //    <Section title={sectionTitle} schema={section.schema} />
      //  )
     case 'ShowData':
      return <ShowDataSection title={sectionTitle} schema={section.schema} pathsToDisplay={section.options.show} />
     case 'Transfer':
     default:
   }
 });
};
 
export const Test = () => {
 const section = useRecoilValue(sectionStateHook)

 
 return <>
   {createSections(templateStructure)}
   {JSON.stringify(section)}

 </>;
};
 

