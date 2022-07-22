import React, { useState } from 'react';
import { Field } from '../components/Fields/Field';
import { ArrayField } from '../components/Fields/ArrayField';
import { useRecoilValue } from 'recoil';
import { draggedTreeJSONNodeHook, sectionStateHook, treeHook,inputDataHook } from '../util/Atoms';
import { Section } from '../components/Sections/Section';
import { SkillsDisplay } from '../components/Data/SkillsDisplay';
import { ShowDataSection } from '../components/Sections/ShowDataSection';
import { TransferSection } from '../components/Sections/TransferSection';
import { pathToJSON } from '../util/toJSON';
import { List } from 'antd';
import { SkillSection } from '../components/Sections/SkillSection';
import { templateStrucutre } from '../templateStructure';
 


const isMatch = (pathArray, currentPath) => {

  let foundIndex = -1
  // TODO can optimize this to not loop thru every time
  let index = 0
  for(let pathItem of pathArray) {
      if(currentPath.match(pathItem)) foundIndex = index
      else break;
      index++

  }
  if(foundIndex == -1) return "none"
  if(foundIndex == pathArray.length - 1) return "complete"
  else return "partial"

}

const findTreeItem = (treeLeft, pathArray) => {
  let minMatchingTreeItem ={}
  // iterate through whats left of the tree
  for(let treeItem of treeLeft) {
      let isMatchReturn = isMatch(pathArray, treeItem.key)
      if(isMatchReturn == 'partial'){
          minMatchingTreeItem = treeItem
      } 
      else if(isMatchReturn == 'complete') return treeItem
  }


  return findTreeItem(minMatchingTreeItem.children, pathArray)


}
 
const createSections = (templateStructure) => {
 return templateStructure.map(section => {
   switch (section.type) {
     case 'Section':
      return
       return <Section title={section.sectionTitle} schema={section.schema} />
    case 'ShowData':
      return <ShowDataSection title={section.sectionTitle} schema={section.schema} pathsToDisplay={section.options.ShowData} />
    case 'SkillSection':
      return
      return <SkillSection title={section.sectionTitle} options={section.options.SkillSection} schema={section.schema} />
     default:
    
   }
 });
};
 
export const Test = () => {
 const section = useRecoilValue(sectionStateHook)
 const inputData = useRecoilValue(inputDataHook)
 const tree = useRecoilValue(treeHook)
 const draggedNode = useRecoilValue(draggedTreeJSONNodeHook)

 return <>
 {JSON.stringify(section)}
 {createSections(templateStrucutre)}

 </>;
};
 

