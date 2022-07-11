import React, { useState } from 'react';
import { Field } from '../components/Fields/Field';
import { ArrayField } from '../components/Fields/ArrayField';
import { templateStructure } from '../templateStructure';
import { useRecoilValue } from 'recoil';
import { sectionStateHook, treeHook } from '../util/Atoms';
import { Section } from '../components/Sections/Section';
import { TreeDisplay } from '../components/Data/TreeDisplay';
import { ShowDataSection } from '../components/Sections/ShowDataSection';
import { TransferSection } from '../components/Sections/TransferSection';
 
 
const createSections = (templateStructure) => {
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
     default:
   }
 });
};
 
export const Test = () => {
 const section = useRecoilValue(sectionStateHook)
 const tree = useRecoilValue(treeHook)

 
 return <>
   {createSections(templateStructure)}
   {JSON.stringify(section)}

 </>;
};
 

