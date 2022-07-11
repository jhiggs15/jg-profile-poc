 
import { Tree, Modal, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import { getUser, test } from '../../getUserQuery';
import { inputData } from '../../inputData';
import { templateStructure } from '../../templateStructure';
 
import {
 ArraySection,
 ParentSection,
} from '../../components/TemplateFields/Section';
import { sectionStateHook, treeHook } from '../../util/Atoms';
import { useRecoilState, useRecoilValue } from 'recoil';
 
const isObject = (item) => typeof item == 'object' && item !== null;
 

 
const treeNodeToColumn = (tree) => {
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
 
const processTemplateStructure = (template) => {
 const schema = [];
 for (let curKey of Object.keys(template)) {
   const data = template[curKey];
   let schemaItem = { title: curKey };
   if (Array.isArray(template[curKey])) {
     schemaItem['type'] = 'ArraySection';
     schemaItem['children'] = processTemplateStructure(data[0]);
     schema.push(schemaItem);
   } else if (isObject(data)) {
     schemaItem['type'] = 'ParentSection';
     schemaItem['children'] = processTemplateStructure(data);
     schema.push(schemaItem);
   } else {
     schemaItem['type'] = 'Item';
     schema.push(schemaItem);
   }
 }
 return schema;
};
 
export const ChooseDataForTemplate = (props) => {
 // Tree Component on Left hand sign with labels for the data
 // You can view the data by hovering over it
 // on the right hand side have inputs for each of the required template names
 // drag item from one side to the other
 
 const [draggedTreeNode, setDraggedTreeNode] = useState();
 const [draggedJSONNode, setDraggedJSONNode] = useState();
 const [isPopupVisible, setPopupVisible] = useState(false);
 const [focusedThing, setFocusedThing] = useState({
   field: '',
   sectionTitle: '',
   sectionType: '',
 });
 const templateSchema = processTemplateStructure(templateStructure);
 const [sectionStates, setSectionStates] = useRecoilState(sectionStateHook);
 const tree = useRecoilValue(treeHook);
 
 // change this to take in section type with optional index param
 const handleFieldChange = (
   fieldName,
   sectionName,
   value,
   sectionType,
   index
 ) => {
   if (sectionType == 'ArraySection') {
     let arraySection = sectionStates[sectionName];
     if (!Array.isArray(arraySection)) arraySection = [];
     else {
       arraySection[index] = { ...arraySection[index], [fieldName]: value };
       setSectionStates({
         ...sectionStates,
         [sectionName]: arraySection,
       });
     }
     // if (!Array.isArray(arraySection)) arraySection = [];
   } else {
     setSectionStates({
       ...sectionStates,
       [sectionName]: { ...sectionStates[sectionName], [fieldName]: value },
     });
   }
 };
 
 const addArrayItem = (sectionName, value) => {
   let arraySection = sectionStates[sectionName];
   if (!Array.isArray(arraySection)) arraySection = [];
   arraySection.push(value);
   setSectionStates({
     ...sectionStates,
     [sectionName]: arraySection,
   });
 };
 
 const removeArrayItem = (sectionName, index) => {
   setSectionStates({
     ...sectionStates,
     [sectionName]: sectionStates[sectionName].filter(
       (item, itemIndex) => itemIndex != index
     ),
   });
 };
 
 const getSection = (sectionName) => {
   return sectionStates[sectionName];
 };
 // take in section type with optional
 const getField = (fieldName, sectionName, index) => {
   if (typeof sectionStates[sectionName] != 'undefined') {
     if (Number.isInteger(index))
       return sectionStates[sectionName][index][fieldName];
     else return sectionStates[sectionName][fieldName];
   }
 
   return null;
 };
 
 const getTemplateItem = (schema, focusedThing) => {
   let foundSection = schema.find(
     (item) =>
       item.title == focusedThing.sectionTitle &&
       item.type == focusedThing.sectionType
   );
   if (focusedThing.field != '') {
     let copyOfFoundSection = { ...foundSection };
     const templateItem = copyOfFoundSection.children.find(
       (item) => item.title == focusedThing.field
     );
 
     if (focusedThing.sectionType == 'ArraySection') {
       copyOfFoundSection.children = [];
       const section = getSection(focusedThing.sectionTitle);
       if (Array.isArray(section)) {
         section.forEach((item) => {
           copyOfFoundSection.children.push(templateItem);
         });
       } else copyOfFoundSection.children.push(templateItem);
     } else copyOfFoundSection.children = [templateItem];
     return typeof copyOfFoundSection == 'undefined'
       ? []
       : [copyOfFoundSection];
   }
 
   // changed to return not children
   return typeof foundSection == 'undefined' ? [] : foundSection;
 };
 
 const createSections = (schema) => {
   if (typeof schema == 'undefined') return;
   if (!Array.isArray(schema)) schema = [schema];
   return schema.map((item, index) => {
     if (item.type == 'ArraySection') {
       return (
         <ArraySection
           title={item.title}
           schema={{ ...item.children[0] }}
           children={getSection(item.title) ?? []}
           handleFieldChange={handleFieldChange}
           getItem={getField}
           addArrayItem={addArrayItem}
           removeArrayItem={removeArrayItem}
           index={index}
           draggedJSONNode={draggedJSONNode}
           triggerPopup={triggerPopup}
         />
       );
     } else if (item.type == 'ParentSection') {
       return (
         <ParentSection
           title={item.title}
           children={item.children}
           handleFieldChange={handleFieldChange}
           getItem={getField}
           index={index}
           draggedJSONNode={draggedJSONNode}
           triggerPopup={triggerPopup}
         />
       );
     }
   });
 };
 const triggerPopup = (title, sectionTitle, sectionType) => {
   setPopupVisible(true);
   const focusedObject = {
     field: title,
     sectionTitle: sectionTitle,
     sectionType,
   };
   setFocusedThing(focusedObject);
 };
 
 return (
   <div>
     {JSON.stringify(sectionStates)}
     <div
       style={{
         display: 'flex',
         flexDirection: 'row',
         paddingTop: 10,
         paddingBottom: 10,
         height: '85vh',
       }}
     >
       <Tree
         draggable
         style={{ height: '100%', overflow: 'scroll' }}
         onDragStart={({ event, node }) => {
           setDraggedTreeNode(node);
           setDraggedJSONNode(treeToJSON(node, inputData, node.title));
         }}
         treeData={tree}
       />
       <Modal
         width={'auto'}
         bodyStyle={{ height: '70vh', overflow: 'scroll' }}
         onCancel={() => setPopupVisible(false)}
         visible={isPopupVisible}
         footer={null}
       >
         <div style={{ display: 'flex', flexDirection: 'column' }}>
           {Array.isArray(draggedJSONNode) &&
           Array.isArray(draggedJSONNode[0]) ? (
             <Table
               style={{ height: '30vh', marginBottom: 20 }}
               scroll={{ y: '20vh' }}
               columns={treeNodeToColumn(draggedTreeNode)}
               dataSource={draggedJSONNode.flat()}
             />
           ) : (
             <Table
               style={{ maxHeight: '30vh', marginBottom: 20 }}
               scroll={{ y: '20vh' }}
               columns={treeNodeToColumn(draggedTreeNode)}
               dataSource={draggedJSONNode}
             />
           )}
           <div style={{ height: '30vh', overflow: 'scroll' }}>
             {createSections(
               getTemplateItem(templateSchema, focusedThing),
               true
             )}
           </div>
         </div>
       </Modal>
       <div
         style={{
           overflow: 'scroll',
           height: '100%',
           width: '100%',
           paddingLeft: 20,
         }}
       >
         {createSections(templateSchema)}
       </div>
     </div>
   </div>
 );
};
 

