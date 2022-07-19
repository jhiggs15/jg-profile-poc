
import { Table, List, Typography, message } from 'antd';
import { TableItem } from '../components/Data/Table/TableItem';
import { getRootValue } from './toJSON';
import { pathToTreeItem } from './toTree';
import React from 'react';

export const isObject = (item) => typeof item == 'object' && item !== null;

export const pathToColumn = (path, tree, inputData) => {
  const columns = []
  const treeItem = pathToTreeItem(path, tree)
  let children = []
  if(!treeItem.hasOwnProperty("children")) children.push(treeItem)
  else children = treeItem.children
  pathArrayToColumns(children, [], columns, inputData) 
  return columns

}




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
          return <TableItem text={text}/>
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
    <TableItem text={data} />
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
 