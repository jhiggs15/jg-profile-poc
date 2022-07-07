import React, { useEffect, useState } from 'react';
import { Field } from './Field';
import { Button } from 'antd';

const createFields = (
  children,
  schema,
  draggedJSONNode,
  triggerPopupSection,
  sectionTitle,
  sectionType,
  handleFieldChange,
  getItem
) => {
  return children.map((arrayItem, index) => {
    const handleFieldChangeNew = (fieldName, value) => {
      handleFieldChange(fieldName, value, index);
    };

    return (
      <Field
        triggerPopup={triggerPopupSection}
        draggedJSONNode={draggedJSONNode}
        title={sectionType == 'ArraySection'? schema.title : arrayItem.title}
        field={
          sectionType == 'ArraySection'
            ? getItem(schema.title, sectionTitle, index)
            : getItem(arrayItem.title, sectionTitle)
        }
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
  addArrayItem
}) => {
  const handleFieldChangeSection = (fieldName, value, index) => {
    handleFieldChange(fieldName, title, value, 'ArraySection', index);
  };

  const triggerPopupSection = (fieldName) => {
    triggerPopup(fieldName, title, 'ArraySection');
  };

  const addItem = () => {
    addArrayItem(title, {[schema.title]: ""})
  };

  const removeLast = () => {
    removeArrayItem(title, children.length - 1);
  };

  return (
    <div>
      <h1
        onDragLeave={() => {
          if(Array.isArray(draggedJSONNode)) triggerPopupSection("")
        }}
      >
        {title}
      </h1>
      {createFields(
        children,
        schema,
        draggedJSONNode,
        () => 1,
        title,
        'ArraySection',
        handleFieldChangeSection,
        getItem
      )}
      {children.length > 0 ? (
        <Button onClick={removeLast}>Remove Last</Button>
      ) : null}

      <Button onClick={addItem}>Create Item</Button>
    </div>
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
    triggerPopup(fieldName, title, 'ParentSection');
  };

  return (
    <>
      <h1
        onDragLeave={() => {
          if(Array.isArray(draggedJSONNode)) triggerPopupSection("")
        }}
      >
        {title}
      </h1>
      {createFields(
        children,
        "",
        draggedJSONNode,
        triggerPopupSection,
        title,
        'ParentSection',
        handleFieldChangeSection,
        getItem
      )}
    </>
  );
};
