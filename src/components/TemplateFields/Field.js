import React, { useEffect, useState } from 'react';
import { Input, Tree } from 'antd';

const isObject = (item) =>  typeof item == "object" &&  item !== null;


export const Field = ({title, index, draggedNodeJSON, triggerPopup, fieldHook}) => {
  const [fieldValue, setFieldValue] = fieldHook

  // when we drag something into a field, check if it has a single key and that that key has no children, if so then simply put the value in It
  // otherwise open the modal and bring up the table transfer
  return(
    <>
      <h2>{title}</h2> 
      <Input value={fieldValue} onChange={(event) => setFieldValue(event.target.value) } onDragLeave={() => {
        const keys = Object.keys(draggedNodeJSON)

        // dragged node has one key and the value for that key is not an object
        if(keys.length == 1 && !isObject(draggedNodeJSON[keys[0]]) ) 
          setFieldValue(draggedNodeJSON[keys[0]])
        else 
          triggerPopup()
      }}  />



    </>
  )

}