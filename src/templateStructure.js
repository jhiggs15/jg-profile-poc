import { useRecoilValue } from "recoil"
import { inputDataHook } from "./util/Atoms"
import { pathToArray, pathToJSON } from "./util/toJSON"
 
 
export const autofillTemplate = (inputData) => {
 let newSection = {}
 Object.keys(templateStructure).forEach(sectionItemName => {
   const sectionItem = templateStructure[sectionItemName]
   let newSectionContent = {...sectionItem.schema}
   if(sectionItem.hasOwnProperty('options') && sectionItem['options'].hasOwnProperty('autofill')){
    const autofillOptions = sectionItem['options']['autofill']
    Object.keys(autofillOptions).forEach(templateItem => {
      const inputDataPath = autofillOptions[templateItem]
      let autofillData = pathToJSON(inputDataPath, inputData)
      if(Array.isArray(autofillData)){
        autofillData = autofillData[0][pathToArray(inputDataPath).pop()]

      } 
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
      school: ".attendedConnection.educationName",
      degree: ".attendedConnection.degreeName"
    }
   },
   // do this within field object
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
    show: [".previousWork", ".nonJGProjects"]
   },
   schema: {
     experienceList: [{ experienceItem: '' }],
   },
 },
 skills: {
   type: 'Skills',
   options : {
    schemaItemKey: 'skillName',
    skillData: {
      allSkills: {
        path: ".skillsConnection"
      },
      JGProjectSkills: {
        path: ".nonJGProjects",
        companyName: "projectFullName",
        skills: "usesSkillConnection"
      },
      prevWorkSkills: {
        path: ".previousWork",
        companyName: "companyName", // indicates where the attribute of the company name in the object, in case it needs to chang
        skills: "usesSkillConnection" // indicates where the list of skills are in the object, in case it needs to chang
      }
    }
   },
   schema: {
     skillList: [{ skillName: '' }],
   },
 },
};
 

