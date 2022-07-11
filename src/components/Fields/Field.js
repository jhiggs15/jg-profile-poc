import React, { useState } from 'react';
import { Input, Tree } from 'antd';
import { useRecoilState } from 'recoil';
import { draggedTreeJSONNodeHook, popupFieldHook, sectionStateHook, treeHook } from '../../util/Atoms';
import { isObject } from '../../util/TreeNodeToColumn';
 
const createField = (sectionTitle, title, defaultValue) => {
  return (
    <Field sectionTitle={sectionTitle} title={title} defaultValue={defaultValue} />
  )
 }

export const Field = ({sectionTitle, title, defaultValue}) => {
 const newTitle = `Field ${title}`
 const [section, setSection] = useRecoilState(sectionStateHook)
 const [draggedTreeJSONNode, setDraggedTreeJSONNode] = useRecoilState(draggedTreeJSONNodeHook);
 const [popupField, setPopupField] = useRecoilState(popupFieldHook)

 const update = (newValue) => {
   const newSection = {...section}
   const newField = {[title] : newValue}
   newSection[sectionTitle] = newField
   setSection(newSection)
 }

 return (
   <div>
     <h1>{newTitle}</h1>
     <Input value={section[sectionTitle][title]} defaultValue={defaultValue}
       onChange={event => update(event.target.value)} 
       onDragOver={(event) => { event.stopPropagation(); event.preventDefault();}} 
       onDrop={(event) => {
        const keys = Object.keys(draggedTreeJSONNode);
        // dragged node has one key and the value for that key is not an object
        if (keys.length == 1 && !isObject(draggedTreeJSONNode[keys[0]])){
          update(draggedTreeJSONNode[keys[0]]);
          // todo probably reset treeNode
        }
        else setPopupField(createField(sectionTitle, title, defaultValue));
      }} 
      />
   </div>
 );
}
