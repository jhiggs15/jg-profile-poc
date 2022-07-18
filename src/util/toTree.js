import { pathToArray } from "./toJSON";

// ignores the key completely and doesnt attempt to dril down
const ignoreCompletely = ['__typename', ];
// ignores the key but can drill down further if its an object
const ignorePartially = ['edges', 'node'];


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


export const pathToTreeItem = (path, tree) => {
  return pathArrayToTreeItem(pathToArray(path), tree)
}

export const pathArrayToTreeItem = (pathArray, treeLeft ) => {
  // iterate through whats left of the tree
  for(let treeItem of treeLeft) {
    let isMatchReturn = isMatch(pathArray, treeItem.key)
    if(isMatchReturn == 'partial'){
      pathArray.shift()
      return pathArrayToTreeItem(pathArray, treeItem.children)
    }
    else if(isMatchReturn == 'complete') return treeItem
  }

  
}

const isMatch = (pathArray, currentPath) => {
  let isPartial = false
  let isFull = true
  for(let pathItem of pathArray) {
    let stringMatch = currentPath.match(pathItem)
    isPartial = isPartial || stringMatch
    isFull = isFull && stringMatch
  }

  if(isFull) return "complete"
  else if(isPartial) return "partial"
  else return "none"
}