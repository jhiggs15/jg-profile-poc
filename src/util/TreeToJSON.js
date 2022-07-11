/**
* Converts a tree to a JSON object from the information within input data
* root: the current root of the tree to be explored
* inputData: the data to create the JSON objects from
* rootTitle: the roots title
*/
export const treeToJSON = (root, inputData, rootTitle) => {
    // if the node has no values
    // TODO : not sure if this is relevant
    // if (Object.keys(node).length == 0){
    //   console.log("here")
    //   return;
    // }
    
    // in this function refernces to a child refers to an attribute
    /*
      {
        title: "attendedConnection",
        key: ".attendedConnection"
        children: [
          { <------ CHILD
            title: "eductationName",
            key: ".attendedConnection.edges.node.educationName"
          }
          ...
        ]
      }
    */
    
    // if the root does not have children, process it as leaf
    if (!root.hasOwnProperty('children'))
      return leafNodeToJSON(pathToArray(root.key), inputData);
    // if it does have children
    else {
      // get the roots children
      let children = root.children;
      // an array where each item is the data for each child
      let arrayOfChildData = [];
      // iterate through all children and get their data
      for (let child of children)
        arrayOfChildData.push(treeToJSON(child, inputData, rootTitle));
      // combine children from
      // arrayOfChildData = [[{educationName: "Sage College"}, ...], [{degreeName: "MBA"}, ...]]
      // to
      // [{educationName: "Sage College", degreeName: "MBA"}, ...]
      // assumes must have more than one child
      return arrayOfChildData[0].map((childData, index) => {
        // if the child data is an array
        // only occurs within nonJGProjects.usesSkillConnection
        if (Array.isArray(childData)) {
          let newChildData = {};
          let data = childData.map((item2, index2) => {
            let newItem = { ...item2 };
            combineJSONResults(
              newItem,
              arrayOfChildData.slice(1),
              (field) => field[index][index2]
            );
            return newItem;
          });
    
          if (rootTitle != root.title) {
            newChildData[root.title] = data;
            return newChildData;
          } else return data;
        } else {
          let newItem = { ...childData };
          combineJSONResults(
            newItem,
            arrayOfChildData.slice(1),
            (field) => field[index]
          );
          return newItem;
        }
      });
    }
   };
    
export const leafNodeToJSON = (pathArray, inputData, showRawData) => {
    let currentData = inputData;
    let pathLeft = [...pathArray];
    let pathItem;
    for (pathItem of pathArray) {
      currentData = currentData[pathItem];
      pathLeft.shift();
      if (Array.isArray(currentData)) return processArray(pathLeft, currentData, showRawData);
    }
    if(showRawData) return currentData
    const returnValue = {};
    returnValue[pathItem] = currentData;
    return returnValue;
   };
    
   const processArray = (pathArray, data, showRawData) => {
    // for every single array item process the rest of the path
    return data.map((item) => leafNodeToJSON(pathArray, item, showRawData));
   };
    
   /**
   *
   */
const combineJSONResults = (item, otherFields, getOtherFieldCallBack) => {
    for (let field of otherFields) {
      Object.assign(item, getOtherFieldCallBack(field));
    }
   };
    
   /**
   * Converts a path to an array of path items
   * path: path to be coneverted
   */
export const pathToArray = (path) => {
    // converts path to array
    let pathArray = path.split('.');
    // removes first .
    pathArray.shift();
    return pathArray;
   };