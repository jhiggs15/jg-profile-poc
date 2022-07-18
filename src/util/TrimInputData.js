
import { isObject } from "./toColumn"


export const removeIgnoresFromInputData = (inputData) => {
    let data = {}
    removeIgnoresFromInputDataRecursive(inputData, data)
    return data
  }
  
export const removeIgnoresFromInputDataRecursive = (dataLeft, parentData) => {
    let curIndex
    if(Array.isArray(parentData)) curIndex = parentData.length
    for(let attributeName of Object.keys(dataLeft)) {
      const attributeData = dataLeft[attributeName]
      // if its an edge then forget about the edge attribute and 
      // set the parent to be all the edges contents
      if(attributeName == '__typename') return
      if (attributeName == 'edges') {
        attributeData.forEach(edgeItem => {
          let currentAttributesData = {}
          removeIgnoresFromInputDataRecursive(edgeItem, currentAttributesData)
          parentData.push(currentAttributesData)
        })
        // it should end here since there is never an attribute with an edge
        return 
      }
      else if(attributeName == 'node') {
        removeIgnoresFromInputDataRecursive(attributeData, parentData)
      }
      else if(isObject(attributeData)) {
        if(Array.isArray(attributeData)) {
          let currentAttributesData = []
          attributeData.forEach(item => {
            removeIgnoresFromInputDataRecursive(item, currentAttributesData)
          })
          parentData[attributeName] = currentAttributesData
        }
        else {
          let currentAttributesData
  
          if(Object.keys(attributeData).includes("edges"))
            currentAttributesData = []
          else currentAttributesData = {}
  
          if(typeof curIndex != "undefined") {
            removeIgnoresFromInputDataRecursive(attributeData, currentAttributesData)
            parentData[curIndex][attributeName] = currentAttributesData
          }
          else {
            removeIgnoresFromInputDataRecursive(attributeData, currentAttributesData)
            parentData[attributeName] = currentAttributesData
          }
  
        }     
      }
      else {
        if(Array.isArray(parentData)) {
          if(parentData.length == curIndex) {
            parentData.push({[attributeName] : attributeData})
          }
          else parentData[curIndex] = {...parentData[curIndex], [attributeName] : attributeData} 
        } 
        else parentData[attributeName] = attributeData
      }
    }
    return
    
  
  
  }