import { Input, Tree } from 'antd';
import React, { useEffect, useState } from 'react';
import { getUser, test } from '../../../getUserQuery';
import { inputData } from '../../../inputData';

// ignores the key completely and doesnt attempt to dril down
const ignoreCompletely = ["__typename", "category"]
// ignores the key but can drill down further if its an object
const ignorePartially = ["edges", "node"]

const queryToTree = (query) => {
  const selections = query.definitions[0].selectionSet.selections[0].selectionSet.selections
  const parentListOfChildren = []
  queryToTreeRecursive(selections, parentListOfChildren, "")
  return parentListOfChildren

}

const queryToTreeRecursive = (selections, parentListOfChildren, path) => {
  for(let selection of selections) {

    let attributeName = selection.name.value
    let newPath = `${path}.${attributeName}`

    if(!ignoreCompletely.includes(attributeName)) {

      if(!ignorePartially.includes(attributeName)) {
        let child = {}
        child.title = attributeName
        child.key = newPath 
        parentListOfChildren.push(child)

        // if the selectionSet is undefined
        if(typeof selection.selectionSet != "undefined") {
          let childsChildren = []
          child.children = childsChildren
          queryToTreeRecursive(selection.selectionSet.selections, childsChildren, newPath)
          
        }
      }
      else if(typeof selection.selectionSet != "undefined") queryToTreeRecursive(selection.selectionSet.selections, parentListOfChildren, newPath)

    }



  }
}

// an object is an object if it is of type object and is not null
const isObject = (item) =>  typeof item == "object" &&  item !== null;
/* 
// gather all items from the JSON array
const processArray = (pathArray, data) => {
  return data.map(node => treeToJSON(node, pathArray))
}

// will get the data based on the path array
// will be able to handle arrays
const treeNodeToJSON = (node, inputData) => {
  let currentData = inputData
  let currentPathArray = [...pathArray]
  let pathArray = node.key.split(".")
  // remove origin from array
  pathArray.shift()
  let pathItem
  for(pathItem of pathArray) {
    currentPathArray.shift()
    // if its not an array then countinue drilling down data by using pathItem
    currentData = currentData[pathItem]
    // if the data is currently an array then do the rest of the processing it as an array
    if(Array.isArray(currentData)) return processArray(currentPathArray, currentData)
  }

  const returnValue = {}
  returnValue[pathItem] = currentData
  return returnValue
}

// converts tree object back to JSON data
const treeToJSON = (node, inputData, returnData) => {
  // if the node does not have children it is just a text value
  if(!node.hasOwnProperty("children")) {
    // convert the path into an array for processing
    console.log(`No children \n${JSON.stringify(node)}`)
    // convert tree node to JSON
    let data = treeNodeToJSON(node, inputData)
    // if its an array do stuff
    return data
  } 
  else {
    let children = node.children
    console.log(`CHildren \n${JSON.stringify(children)}`)

    let arrayOfData = []
    let isFirst = true
    for(let child of children) {
      let data = treeToJSON(child, inputData)
      console.log(`From second \n${JSON.stringify(data)}`)

      data.forEach((item, index) => {
        if(isFirst) arrayOfData.push({})
        arrayOfData[index][child.title] = item 
      } )

      if(isFirst) isFirst = false
    }
    return arrayOfData
  }

} */

const processArray = (pathArray, data) => {
  // for every single array item process the rest of the path
  return data.map(item => treeNodeToJSON(pathArray, item))
}

const treeNodeToJSON = (pathArray, inputData) => {

  let currentData = inputData
  let pathLeft = [...pathArray]
  let pathItem
  for(pathItem of pathArray) {
    currentData = currentData[pathItem]
    pathLeft.shift()
    if(Array.isArray(currentData)) return processArray(pathLeft, currentData)
  }

  const returnValue = {}
  returnValue[pathItem] = currentData
  return returnValue


}

const treeToJSON = (node, inputData) => {
  if(!node.hasOwnProperty("children")) {
    let pathArray = node.key.split(".")
    pathArray.shift()
    return treeNodeToJSON(pathArray, inputData)
  }
  else {
    let children = node.children

    let arrayOfData = []
    let isFirst = true
    for(let child of children) {
      let data = treeToJSON(child, inputData)

      data.forEach((item, index) => {
        if(isFirst) arrayOfData.push({})
        if(typeof item[child.title] == "undefined") arrayOfData[index][child.title] = item
        else arrayOfData[index][child.title] = item[child.title]
        
      })

      isFirst = false

    }
    return arrayOfData
  }

}

export const ChooseDataForTemplate = (props) => {

  // Tree Component on Left hand sign with labels for the data 
  // You can view the data by hovering over it
  // on the right hand side have inputs for each of the required template names
  // drag item from one side to the other

  const [inputValue, setInputValue] = useState()
  const [inputValue2, setInputValue2] = useState()
  const [draggedNode, setDraggedNode] = useState()
  const [treeData, setTreeData] = useState({})
  
  return(
    <div style={{display: "flex", flexDirection: "row"}}>
      <Tree draggable onDragStart={({event, node}) => setDraggedNode(node)} treeData={queryToTree(getUser)}/>
      <div>
        <Input value={inputValue} onChange={(event) => setInputValue(event.target.value) } onDragLeave={(e) => console.log(treeToJSON(draggedNode, inputData))} />

      </div>
    
    </div>
  )
};
