import { useRecoilValue } from "recoil"
import { inputData } from "./inputData"
import { inputDataHook } from "./util/Atoms"
import { pathToArray, pathToJSON } from "./util/toJSON"
 

const fillTemplateRecursively = (sectionSchema, parentsChildren, inputData) => {
  Object.keys(sectionSchema).forEach(schemaItemName => {
    const currentItem = sectionSchema[schemaItemName]
    if(currentItem.type == "Object") {
      const currentItemSchema = currentItem.schema
      const children = {}
      fillTemplateRecursively(currentItemSchema, children, inputData)
      parentsChildren[schemaItemName] = children
    }
    else if(currentItem.type == "Array") {
      const currentItemSchema = currentItem.schema
      const children = {}
      fillTemplateRecursively(currentItemSchema, children, inputData)
      parentsChildren[schemaItemName] = [children]
    }
    else if(currentItem.type == "Field") {
      if(currentItem.hasOwnProperty("autofill")) {
        const pathToData = currentItem.autofill
        let autofillData = pathToJSON(pathToData, inputData)
        if(Array.isArray(autofillData)) autofillData = autofillData[0][pathToArray(pathToData).pop()]
        parentsChildren[schemaItemName] = autofillData
      }
      else parentsChildren[schemaItemName] = ""
    }

  }) 

  return parentsChildren
}

export const autofillTemplate = (inputData) => {
  const newSection = {}
  templateStrucutre.forEach(section => {
    let sectionSchema = section.schema

    fillTemplateRecursively(sectionSchema, newSection, inputData)
  })
  return newSection
}
 


export const templateStrucutre = [
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
            maxLength: 35
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
            maxLength: 4,
            schema: {
              experienceItem: {
                type: "Field",
                maxLength: 250
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
            maxLength: 15,
            schema: {
              skillName: {
                type: "Field",
                maxLength: 15
              }
            }
          },
        }


      }

    }
  }
]
 

