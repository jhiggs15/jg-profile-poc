
import { Table, List } from 'antd';
import { getRootValue } from './toJSON';
import { pathToTreeItem } from './toTree';

export const isObject = (item) => typeof item == 'object' && item !== null;

export const pathToColumn = (path, tree, inputData) => {
  console.log(path)
  const columns = []
  const treeItem = pathToTreeItem(path, tree)
  console.log(treeItem)
  console.log(inputData)
  let children = []
  if(!treeItem.hasOwnProperty("children")) children.push(treeItem)
  else children = treeItem.children
  pathArrayToColumns(children, [], columns, inputData) 
  return columns

}


/*
  - cycle through children
  - if the child has children 
    - add it to the children field
  - if it does not attach a dataindex
  -   if it does not and its an array?
*/

const pathArrayToColumns = (listOfNodes, path, columns, inputData) => {
  for(let child of listOfNodes) {
    const newPath = [...path, child.title]
    const column = { title: child.title }
    if(child.hasOwnProperty("children")) {
      const newChildren = []
      pathArrayToColumns(child.children, newPath, newChildren, inputData)
      column.children = newChildren
    }
    else {
      column.dataIndex = newPath
      column.render = (text, record, index) => {
        if(typeof text != 'undefined' && text !== null){
          return <p>{text}</p>
        } 
        else{
          return listToTableItem(child, newPath, record )
        } 

    
      }
    } 

    columns.push(column)
  }
}

const listToTableItem = (treeItem, path, data) => {
  const rawValues = getRootValue(path, data)
  return createRecusiveList(rawValues)

}

const createRecusiveList = (data) => {

  if(Array.isArray(data)){
    return(
      <List itemLayout="horizontal" dataSource={data} 
        renderItem={dataItem => createRecusiveList(dataItem) }
      />
    )
  } 
  else return (
    <p>{data}</p>
  )


}

 
export const treeNodeToColumn = (treeNode, inputData) => {

  const columns = []
  let children = []
  if(!treeNode.hasOwnProperty("children")) children.push(treeNode)
  else children = treeNode.children
  pathArrayToColumns(children, [], columns, inputData) 
  return columns
 
};
 