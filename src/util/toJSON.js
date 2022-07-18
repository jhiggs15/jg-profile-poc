import { inputData } from "../inputData"
import { isObject } from "./toColumn";

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

export const pathArrayToJSON = (pathArray, inputData) => {
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

export const getRootValue = (pathArray, data) => {
    let currentData = data
    for(let pathItem of pathArray) {
        if(Array.isArray(currentData)) currentData = currentData.map(item => recusiveMap(item, pathItem))
        else {
            let currentDataKeys = Object.keys(currentData)
            if(currentDataKeys.includes(pathItem)) currentData = currentData[pathItem]
            // TODO this could be a pain point we assume that if the pathItem isnt there it must be in first ObjectKey
            // this clause is to deal with data in an irregular format because of the removed nodes/edges attributes.
            // an example includes
            // the function will return [ ["Data", "Data2"] ]
            /*
            "usesSkillConnection": [
                category: [
                    {value: "Data"},
                    {value: "Data2"}
                ]

            ]           
            */
            else {
                currentData = currentData[currentDataKeys[0]]
                currentData = recursiveEdgeCase(pathItem, currentData)
                
            }
        } 
    }

    return currentData
}

const recursiveEdgeCase = (pathItem, currentData) => {
    let containsItem = true
    const returnArray = []
    if(Array.isArray(currentData)){
        currentData.forEach(newItem => {
            const objectKeys = Object.keys(newItem)
            containsItem = objectKeys.includes(pathItem)
            if(containsItem) returnArray.push(newItem[pathItem]) 
            else returnArray.push(recursiveEdgeCase(pathItem, newItem[objectKeys[0]]))
        })
    } 
    return returnArray
}

const recusiveMap = (item, attribute) => {
    if(Array.isArray(item)) return item.map(item2 => recusiveMap(item2, attribute))
    else return item[attribute]

}