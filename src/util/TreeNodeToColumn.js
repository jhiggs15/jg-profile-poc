
import { Tree, Modal, Table, Input } from 'antd';

export const isObject = (item) => typeof item == 'object' && item !== null;
 
export const treeNodeToColumn = (tree) => {
 const columns = [];
 if (!isObject(tree)) return columns;
 else if (!tree.hasOwnProperty('children'))
   return [{ title: tree.title, dataIndex: tree.title }];
 else treeNodeToColumnRecursive(tree.children, columns, []);
 
 return columns;
};
 
// TODO this can be changed so that column is an attribute of the return of queryToTree
const treeNodeToColumnRecursive = (tree, columns, path) => {
 for (let treeNode of tree) {
   const newPath = [...path];
   newPath.push(treeNode.title);
   if (treeNode.hasOwnProperty('children')) {
     const treeNodeColumns = treeNodeToColumn(treeNode);
     columns.push({
       title: treeNode.title,
       dataIndex: newPath,
       render: (text) => {
         return <Table columns={treeNodeColumns} dataSource={text} />;
       },
     });
   } else columns.push({ title: treeNode.title, dataIndex: newPath });
 }
};