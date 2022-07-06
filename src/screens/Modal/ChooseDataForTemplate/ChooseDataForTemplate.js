import { Tree, Modal, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import { getUser, test } from '../../../getUserQuery';
import { inputData } from '../../../inputData';
import { Field } from '../../../components/TemplateFields/Field';

const isObject = (item) => typeof item == 'object' && item !== null;

// ignores the key completely and doesnt attempt to dril down
const ignoreCompletely = ['__typename', 'category'];
// ignores the key but can drill down further if its an object
const ignorePartially = ['edges', 'node'];

const queryToTree = (query) => {
  const selections =
    query.definitions[0].selectionSet.selections[0].selectionSet.selections;
  const parentListOfChildren = [];
  queryToTreeRecursive(selections, parentListOfChildren, '');
  return parentListOfChildren;
};

const queryToTreeRecursive = (selections, parentListOfChildren, path) => {
  for (let selection of selections) {
    let attributeName = selection.name.value;
    let newPath = `${path}.${attributeName}`;

    if (!ignoreCompletely.includes(attributeName)) {
      if (!ignorePartially.includes(attributeName)) {
        let child = {};
        child.title = attributeName;
        child.key = newPath;
        parentListOfChildren.push(child);

        // if the selectionSet is undefined
        if (typeof selection.selectionSet != 'undefined') {
          let childsChildren = [];
          child.children = childsChildren;
          queryToTreeRecursive(
            selection.selectionSet.selections,
            childsChildren,
            newPath
          );
        }
      } else if (typeof selection.selectionSet != 'undefined')
        queryToTreeRecursive(
          selection.selectionSet.selections,
          parentListOfChildren,
          newPath
        );
    }
  }
};

const processArray = (pathArray, data) => {
  // for every single array item process the rest of the path
  return data.map((item) => treeNodeToJSON(pathArray, item));
};

const treeNodeToJSON = (pathArray, inputData) => {
  let currentData = inputData;
  let pathLeft = [...pathArray];
  let pathItem;
  for (pathItem of pathArray) {
    currentData = currentData[pathItem];
    pathLeft.shift();
    if (Array.isArray(currentData)) return processArray(pathLeft, currentData);
  }

  const returnValue = {};
  returnValue[pathItem] = currentData;
  return returnValue;
};

const combineJSONResults = (item, otherFields, getOtherFieldCallBack) => {
  for (let field of otherFields) {
    Object.assign(item, getOtherFieldCallBack(field));
  }
};

const treeToJSON = (node, inputData, rootTitle) => {
  if (Object.keys(node).length == 0) return;
  if (!node.hasOwnProperty('children')) {
    let pathArray = node.key.split('.');
    pathArray.shift();
    return treeNodeToJSON(pathArray, inputData);
  } else {
    let children = node.children;
    // an array where each item is all the data for a given attribute
    let arrayOfFieldData = [];
    for (let child of children)
      arrayOfFieldData.push(treeToJSON(child, inputData, rootTitle));
    return arrayOfFieldData[0].map((item, index) => {
      if (Array.isArray(item)) {
        let objectToReturn = {};
        let data = item.map((item2, index2) => {
          let newItem = { ...item2 };
          combineJSONResults(
            newItem,
            arrayOfFieldData.slice(1),
            (field) => field[index][index2]
          );
          return newItem;
        });
        if (rootTitle != node.title) {
          objectToReturn[node.title] = data;
          return objectToReturn;
        } else return data;
      } else {
        let newItem = { ...item };
        combineJSONResults(
          newItem,
          arrayOfFieldData.slice(1),
          (field) => field[index]
        );
        return newItem;
      }
    });
  }
};

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

export const ChooseDataForTemplate = (props) => {
  // Tree Component on Left hand sign with labels for the data
  // You can view the data by hovering over it
  // on the right hand side have inputs for each of the required template names
  // drag item from one side to the other

  const [draggedTreeNode, setDraggedTreeNode] = useState();
  const [draggedJSONNode, setDraggedJSONNode] = useState();
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState();
  const treeData = queryToTree(getUser);
  const templateSchema = [{ title: 'Field', type: 'Single' }];
  const fieldStates = templateSchema.map(() => useState());

  const triggerPopup = (index) => {
    setPopupVisible(true);
    setFocusedIndex(index);
  };

  const fields = templateSchema.map((item, index) => (
    <Field
      title={item.title}
      fieldHook={fieldStates[index]}
      draggedNodeJSON={draggedJSONNode}
      triggerPopup={() => triggerPopup(index)}
    />
  ));

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <Tree
        draggable
        onDragStart={({ event, node }) => {
          setDraggedTreeNode(node);
          setDraggedJSONNode(treeToJSON(node, inputData, node.title));
        }}
        treeData={treeData}
      />
      <Modal
        width={'auto'}
        bodyStyle={{ height: '70vh', overflow: 'scroll' }}
        onCancel={() => setPopupVisible(false)}
        visible={isPopupVisible}
        footer={null}
      >
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          {Array.isArray(draggedJSONNode) &&
          Array.isArray(draggedJSONNode[0]) ? (
            <div style={{ flexDirection: 'column' }}>
              {draggedJSONNode
                .filter((item) => item.length > 0)
                .map((item) => {
                  return (
                    <Table
                      columns={treeNodeToColumn(draggedTreeNode)}
                      dataSource={item}
                    />
                  );
                })}
            </div>
          ) : (
            <Table
              columns={treeNodeToColumn(draggedTreeNode)}
              dataSource={draggedJSONNode}
            />
          )}

          {fields[focusedIndex]}
        </div>
      </Modal>
      <div>{fields}</div>
    </div>
  );
};
