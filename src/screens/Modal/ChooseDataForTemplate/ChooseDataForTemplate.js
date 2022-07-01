import { Input, Tree } from 'antd';
import React, { useState } from 'react';
import { inputData } from '../../../inputData';

const createTree = (dataToSearch) => {
  let treeNodes = []
  

  recursion(dataToSearch, treeNodes, "")
  return treeNodes

}

const isObject = (item) => {
  return typeof item == "object" &&  item !== null
}

// ignores the key completely and doesnt attempt to dril down
const ignoreCompletely = ["__typename"]
// ignores the key but can drill down further if its an object
const ignorePartially = ["edges", "node"]
// const ignorePartially = []

const recursion = (dataToSearch, listOfChildren, origin) => {
  let keys = Object.keys(dataToSearch)
  // iterate through the objects keys
  for(let key of keys) {
    // ignore keys that should be hidden
    if(!ignoreCompletely.includes(key)) {
      let node = {}
      // if we ignore the key partially we want to not include this key but include all of 
      if(!ignorePartially.includes(key)){
        node.title = key
        node.key = `${origin}.${key}`
        listOfChildren.push(node)
      }
      // get the value of the key
      const val = dataToSearch[key]
      // determine if it has keys
      if(isObject(val)){
        let children = []
        node.children = children
        if(!Array.isArray(val)) {
          if(ignorePartially.includes(key))
            recursion(val, listOfChildren, `${origin}.${key}`)
          else
            recursion(val, children, node.key)
        }
        else if(val.length > 0){
          if(ignorePartially.includes(key))
            recursion(val[0], listOfChildren, `${origin}.${key}`)
          else
            recursion(val[0], children, node.key)
        } 
        // if its an array determin if each value has keys
        
      } 

    }

  }
}

export const ChooseDataForTemplate = (props) => {

  // Tree Component on Left hand sign with labels for the data 
  // You can view the data by hovering over it
  // on the right hand side have inputs for each of the required template names
  // drag item from one side to the other

  const [inputValue, setInputValue] = useState()
  const [draggedNode, setDraggedNode] = useState()

  return(
    <>
      <Tree draggable onDragStart={({event, node}) => setDraggedNode(node)} treeData={createTree(inputData)}/>
      <Input value={inputValue} onChange={(event) => setInputValue(event.target.value) } onDragLeave={(e) => setInputValue(draggedNode.title)} />
    
    </>
  )
};
