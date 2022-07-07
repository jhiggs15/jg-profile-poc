import React, { useEffect, useState } from 'react';
import { Field } from './Field';
import { Button } from 'antd';

const createFields = (
  children,
  draggedJSONNode,
  triggerPopupSection,
  sectionTitle,
  handleFieldChange,
  getItem
) => {
  return children.map((arrayItem, index) => {
    const handleFieldChangeNew = (fieldName, value) => {
      console.log(fieldName);
      handleFieldChange(fieldName, value, index);
    };

    return (
      <Field
        triggerPopup={triggerPopupSection}
        draggedJSONNode={draggedJSONNode}
        title={arrayItem.title}
        field={getItem(arrayItem.title, sectionTitle)}
        handleFieldChange={handleFieldChangeNew}
      />
    );
  });
};

export const ArraySection = ({
  title,
  children,
  schema,
  getItem,
  removeArrayItem,
  handleFieldChange,
  draggedJSONNode,
  triggerPopup,
}) => {
  const [allChildren, setAllChildren] = useState(children);

  const handleFieldChangeSection = (fieldName, value, index) => {
    handleFieldChange(fieldName, title, value, 'ArraySection', index);
  };

  const triggerPopupSection = (fieldName) => {
    triggerPopup(fieldName, title);
  };

  const addItem = () => {
    setAllChildren([...allChildren, { ...schema }]);
  };

  const removeLast = () => {
    removeArrayItem(title, allChildren.length - 1);
    const newChildren = [...allChildren];
    newChildren.pop();
    setAllChildren([...newChildren]);
  };

  return (
    <>
      <h1>{title}</h1>
      {createFields(
        allChildren,
        draggedJSONNode,
        triggerPopupSection,
        title,
        handleFieldChangeSection,
        getItem
      )}
      {allChildren.length > 0 ? (
        <Button onClick={removeLast}>Remove Last</Button>
      ) : null}

      <Button onClick={addItem}>Create Item</Button>
    </>
  );
};

export const ParentSection = ({
  title,
  children,
  getItem,
  handleFieldChange,
  draggedJSONNode,
  triggerPopup,
}) => {
  const handleFieldChangeSection = (fieldName, value) =>
    handleFieldChange(fieldName, title, value);

  const triggerPopupSection = (fieldName) => {
    triggerPopup(fieldName, title);
  };

  return (
    <>
      <h1>{title}</h1>
      {createFields(
        children,
        draggedJSONNode,
        triggerPopupSection,
        title,
        handleFieldChangeSection,
        getItem
      )}
    </>
  );
};
