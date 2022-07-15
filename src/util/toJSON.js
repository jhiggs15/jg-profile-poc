import { inputData } from "../inputData"

/**
* Converts a tree to a JSON object from the information within input data
* root: the current root of the tree to be explored
* inputData: the data to create the JSON objects from
* rootTitle: the roots title
*/
export const treeToJSON = (currentNode, inputData) => {
    return pathToJSON(currentNode.key, inputData)
  };

/**
 * Converts a path to an array of path items
 * path: path to be coneverted
 */
export const pathToArray = (path) => {
    // converts path to array
    let pathArray = path.split('.');
    //  removes first .
    pathArray.shift();
    return pathArray;
};

export const pathToJSON = (path, inputData) => {
    return pathArrayToJSON(pathToArray(path), inputData) 
}

const pathArrayToJSON = (pathArray, inputData) => {
    let currentData = inputData
    let currentPath = [...pathArray]
    for(let pathItem of pathArray) {
        if(Array.isArray(currentData)) {
            return currentData.map(item => {
                return {[pathItem] : pathArrayToJSON(currentPath, item)}
            })
        }
        else 
            currentData = currentData[pathItem]

        currentPath.shift()
    }

    return currentData

}