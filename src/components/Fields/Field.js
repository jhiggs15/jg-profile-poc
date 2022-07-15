import React, { useState } from 'react';
import { Input, Tree } from 'antd';
import { useRecoilState } from 'recoil';
import { draggedTreeJSONNodeHook, popupFieldHook, sectionStateHook, treeHook } from '../../util/Atoms';
import { isObject } from '../../util/toColumn';
 
const createField = (sectionTitle, title, defaultValue) => {
  return (
    <Field sectionTitle={sectionTitle} title={title} defaultValue={defaultValue} />
  )
 }

export const Field = ({sectionTitle, title, defaultValue}) => {
 const newTitle = `${title}`
 const [section, setSection] = useRecoilState(sectionStateHook)
 const [draggedTreeJSONNode, setDraggedTreeJSONNode] = useRecoilState(draggedTreeJSONNodeHook);
 const [popupField, setPopupField] = useRecoilState(popupFieldHook)

 const update = (newValue) => {
   const newSection = {...section}
   newSection[sectionTitle] = {...newSection[sectionTitle], [title] : newValue}
   setSection(newSection)
 }

 return (
   <div>
     <h1>{newTitle}</h1>
     <Input.TextArea value={section[sectionTitle][title]} defaultValue={defaultValue}
       onChange={event => update(event.target.value)} 
       autoSize={{ minRows: 2, maxRows: 5 }}
       onDragOver={(event) => { event.stopPropagation(); event.preventDefault();}} 
       onDrop={(event) => {
        console.log(draggedTreeJSONNode)
        if(!isObject(draggedTreeJSONNode)) 
          update(draggedTreeJSONNode);
        else 
          setPopupField(createField(sectionTitle, title, defaultValue));
      }} 
      />
   </div>
 );
}
