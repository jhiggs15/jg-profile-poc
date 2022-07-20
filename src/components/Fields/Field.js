import React, { useEffect, useState, useRef } from 'react';
import { Input, Tree, message } from 'antd';
import { useRecoilState, useRecoilValue } from 'recoil';
import { clipboardHook, draggedTreeJSONNodeHook, popupFieldHook, sectionStateHook, treeHook } from '../../util/Atoms';
import { isObject } from '../../util/toColumn';
import { setVerbosity } from 'ts-invariant';
 
const createField = (title, sectionDataTitle, fieldName, characterLimit) => {
  return (
<Field characterLimit={characterLimit} key={sectionDataTitle+fieldName} title={title} sectionDataTitle={sectionDataTitle} fieldName={fieldName} />
  )
 }

export const Field = ({title, sectionDataTitle, fieldName, characterLimit}) => {
 const [section, setSection] = useRecoilState(sectionStateHook)
 const [draggedTreeJSONNode, setDraggedTreeJSONNode] = useRecoilState(draggedTreeJSONNodeHook);
 const [popupField, setPopupField] = useRecoilState(popupFieldHook)
 const [status, setStatus] = useState(null)
 const clipboard = useRecoilValue(clipboardHook)

 const update = (newValue) => {
   const newSection = {...section}
   newSection[sectionDataTitle] = {...newSection[sectionDataTitle], [fieldName] : newValue}
   setSection(newSection)
 }

 const append = (newValue) => {
  const newSection = {...section}
  newSection[sectionDataTitle] = {...newSection[sectionDataTitle], [fieldName] : newSection[sectionDataTitle][fieldName] == "" ? newValue : `${newSection[sectionDataTitle][fieldName]}${newValue}`}
  setSection(newSection)
}

const rightClick = (event) => {
  event.preventDefault()
  if(event.ctrlKey) update(clipboard)
  else append(clipboard)
  message.success("Pasted from Internal Clipboard!", .8)
 }

 const showCount = ({count}) =>{
  if(count > characterLimit) setStatus("error")
  else setStatus(null)
  return `${count}/${characterLimit}`
 } 

 return (
   <div>
     <h1>{title}</h1>
     <Input.TextArea onContextMenu={rightClick}  value={section[sectionDataTitle][fieldName]} showCount={{formatter: showCount}}
       onChange={event => update(event.target.value)} status={status}
       autoSize={{ minRows: 2, maxRows: 5 }}
       onDragOver={(event) => { event.stopPropagation(); event.preventDefault();}} 
       onDrop={(event) => {
        if(!isObject(draggedTreeJSONNode)) 
          update(draggedTreeJSONNode);
        else 
          setPopupField(createField(title, sectionDataTitle, fieldName, characterLimit));
      }} 
      />
   </div>
 );
}
