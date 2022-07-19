import React, { useEffect, useState, useRef } from 'react';
import { Input, Tree, message } from 'antd';
import { useRecoilState, useRecoilValue } from 'recoil';
import { clipboardHook, draggedTreeJSONNodeHook, popupFieldHook, sectionStateHook, treeHook } from '../../util/Atoms';
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
 const clipboard = useRecoilValue(clipboardHook)

 const update = (newValue) => {
   const newSection = {...section}
   newSection[sectionTitle] = {...newSection[sectionTitle], [title] : newValue}
   setSection(newSection)
 }

 const append = (newValue) => {
  const newSection = {...section}
  newSection[sectionTitle] = {...newSection[sectionTitle], [title] : newSection[sectionTitle][title] == "" ? newValue : `${newSection[sectionTitle][title]}${newValue}`}
  setSection(newSection)
}

const rightClick = (event) => {
  event.preventDefault()
  if(event.ctrlKey) update(clipboard)
  else append(clipboard)
  message.success("Pasted from Internal Clipboard!", .5)
 }

 return (
   <div>
     <h1>{newTitle}</h1>
     <Input.TextArea onContextMenu={rightClick}  value={section[sectionTitle][title]} defaultValue={defaultValue}
       onChange={event => update(event.target.value)} 
       autoSize={{ minRows: 2, maxRows: 5 }}
       onDragOver={(event) => { event.stopPropagation(); event.preventDefault();}} 
       onDrop={(event) => {
        if(!isObject(draggedTreeJSONNode)) 
          update(draggedTreeJSONNode);
        else 
          setPopupField(createField(sectionTitle, title, defaultValue));
      }} 
      />
   </div>
 );
}
