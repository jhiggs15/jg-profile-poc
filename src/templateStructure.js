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

export const newTemplateStrucutre = [
  {
    sectionTitle: "General Information",
    type: "Section",
    schema: {
      userinfo: {
        type: "Object",
        schema: {
          name: {
            title: "Name",
            type: "Field",
            autofill: ".name",
            maxLength: 15
          },
          title: {
            title: "Title",
            type: "Field",
            autofill: ".tense_title",
            maxLength: 30
          },
          funfact: {
            title: "Fun Fact",
            type: "Field",
            autofill: ".biography",
            maxLength: 50
          },
          school: {
            title: "School",
            type: "Field",
            autofill: ".attendedConnection.educationName",
            maxLength: 35
          },
          degree: {
            title: "Degree",
            type: "Field",
            autofill: ".attendedConnection.degreeName",
            maxLength: 40
          },
        }
      }

    }
  },
  {
    sectionTitle: "Experience",
    type: "ShowData",
    options: {
      ShowData: [".previousWork", ".nonJGProjects"]

    },
    schema: {
      experience: {
        type: "Object",
        schema: {
          experienceList : {
            type: "Array",
            maxLength: 10,
            schema: {
              experienceItem: {
                type: "Field",
                maxLength: 20
              }
            }
          }
        }

      }

    }
  },
  {
    sectionTitle: 'Skills',
    type: "SkillSection",
    options: {
      SkillSection: {
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
      skills: {
        type: "Object",
        schema: {
          skillList : {
            type: "Array",
            maxLength: 10,
            schema: {
              skillName: {
                maxLength: 20
              }
            }
          },
        }


      }

    }
  }
]
 
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
 

