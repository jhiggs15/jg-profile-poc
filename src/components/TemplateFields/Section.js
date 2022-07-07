import React, { useEffect, useState } from 'react';
import { Field } from './Field';

export const ArraySection = ({
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

  const createFields = () => {
    return children.map((arrayItem, arrayItemIndex) => {
      return (
        <Field
          triggerPopup={triggerPopupSection}
          draggedJSONNode={draggedJSONNode}
          title={arrayItem.title}
          field={getItem(arrayItem.title, title)}
          handleFieldChange={handleFieldChangeSection}
        />
      );
    });
  };

  return (
    <>
      <h1>{title}</h1>
      {createFields()}
    </>
  );
};

export const ParentSection = ({ title, children, index, hooks, setHooks }) => {
  return (
    <>
      <h1>{title}</h1>
    </>
  );
};
