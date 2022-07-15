import { isObject } from "./toColumn"

// ignores the key completely and doesnt attempt to dril down
const ignoreCompletely = ['__typename', ];
// ignores the key but can drill down further if its an object
const ignorePartially = ['edges', 'node'];


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

/**
 * Converts apollo gql query to a tree item
 * query: gql query to convert
 */
export const queryToTree = (query) => {
  // from the query extracts the return section
  // TODO: this should be tested to see if its applciable to a broader set of queries
  const selections =
    query.definitions[0].selectionSet.selections[0].selectionSet.selections;
  // the root array that will be passed between recursive calls, as iterations countinue
  // objects will be added to it
  const parentListOfChildren = [];
  // beginning of recursion
  queryToTreeRecursive(selections, parentListOfChildren, '');
  return parentListOfChildren;
};

/**
 *
 * selections: The current portion of the return set we are dealing with
 * parentListOfChildren: the list of children for the current expansion
 * orignally this is the root but as recursive calls are made it changes to be
 * a list of children for the return item that called queryToTreeRecursive
 * path: The path taken to get to the parent
 */
const queryToTreeRecursive = (children, parentListOfChildren, pathToParent) => {
  // iterates through each child of the parent
  for (let child of children) {
    // gets the name of the child
    let attributeName = child.name.value;
    // calculates the new path of the child
    let newPath = `${pathToParent}.${attributeName}`;
    // if the key is ignored completely it nor its possible children will be
    // included in the tree
    if (!ignoreCompletely.includes(attributeName)) {
      // if the key should be ignored partially, we dont want to see it within the produced tree structure
      // but we want to see its children
      if (!ignorePartially.includes(attributeName)) {
        // creates a tree representation of the current child
        let treeNodeChild = {};
        treeNodeChild.title = attributeName;
        treeNodeChild.key = newPath;
        // updates the parents list of children
        parentListOfChildren.push(treeNodeChild);
        // if the new child has children
        if (typeof child.selectionSet != 'undefined') {
          // create list of children
          let childsChildren = [];
          treeNodeChild.children = childsChildren;
          // start a new recursive expansion for the current child
          queryToTreeRecursive(
            child.selectionSet.selections,
            childsChildren,
            newPath
          );
        }
      }
      // if it is ignored partially but has children, we still explore its children
      // but if any are found we add it to the current parent
      else if (typeof child.selectionSet != 'undefined') {
        queryToTreeRecursive(
          child.selectionSet.selections,
          parentListOfChildren,
          pathToParent
        );
      }

    }
  }
};


/* 
export const findTreeItem = (treeLeft, pathArray) => {
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

 */