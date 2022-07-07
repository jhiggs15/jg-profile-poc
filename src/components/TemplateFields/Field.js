import React, { useEffect, useState } from 'react';
import { Input, Tree } from 'antd';

const isObject = (item) => typeof item == 'object' && item !== null;

// title={arrayItem.title} field={fields[arrayItem.title]} handleFieldChange={handleFieldChange}
export const Field = ({
  title,
  draggedJSONNode,
  triggerPopup,
  handleFieldChange,
  field,
}) => {
  // when we drag something into a field, check if it has a single key and that that key has no children, if so then simply put the value in It
  // otherwise open the modal and bring up the table transfer
  return (
    <>
      <h2>{title}</h2>
      <Input.TextArea
        value={field}
        style={{ minWidth: 250 }}
        onChange={(event) => handleFieldChange(title, event.target.value)}
        autoSize={{ minRows: 3, maxRows: 5 }}
        onDragLeave={() => {
          const keys = Object.keys(draggedJSONNode);
          // dragged node has one key and the value for that key is not an object
          if (keys.length == 1 && !isObject(draggedJSONNode[keys[0]]))
            handleFieldChange(title, draggedJSONNode[keys[0]]);
          else triggerPopup(title);
        }}
      />
    </>
  );
};
