import { useRecoilValue } from "recoil"
import { inputDataHook } from "./util/Atoms"
import { leafNodeToJSON, pathToArray } from "./util/TreeToJSON"
 
 
export const getTemplateStructureInitValue = (inputData) => {
 let newSection = {}
 Object.keys(templateStructure).forEach(sectionItemName => {
   const sectionItem = templateStructure[sectionItemName]
   let newSectionContent = {...sectionItem.schema}
   if(sectionItem.hasOwnProperty('options') && sectionItem['options'].hasOwnProperty('autofill')){
    const autofillOptions = sectionItem['options']['autofill']
    Object.keys(autofillOptions).forEach(templateItem => {
      const inputDataPath = autofillOptions[templateItem]
      let autofillData = leafNodeToJSON(pathToArray(inputDataPath), inputData, true)
      if(Array.isArray(autofillData)) autofillData = autofillData[0]
      newSectionContent[templateItem] = autofillData
    })

   }
   // TODO left off here need to autofill similar fields if they are not an array
   newSection[sectionItemName] = newSectionContent
 })
 
 return newSection
 
}
 
export const templateStructure = {
 userinfo: {
   type: 'Section',
   options:{
    autofill: {
      name: ".name",
      title: ".tense_title",
      funfact: ".biography",
      school: ".attendedConnection.edges.node.educationName",
      degree: ".attendedConnection.edges.degreeName"
    }
   },
   schema: {
     name: '',
     title: '',
     funfact: '',
     school: '',
     degree: '',
   },
 },
 experience: {
   type: 'ShowData',
   options: {
    show: [".previousWorkConnection", ".nonJGProjects"]
   },
   schema: {
     experienceList: [{ experienceItem: '' }],
   },
 },
 skills: {
   type: 'Transfer',
   options : {
    transfer: [{title: "Non JG Project Skills", path: '.nonJGProjects.usesSkillConnection.edges.node.name'}, {title: "Skills", path: '.skills.name'}, {title: "Certifications", path:'.certs.name'}  ]
   },
   schema: {
     skillList: [{ skillName: '' }],
   },
 },
};
 

