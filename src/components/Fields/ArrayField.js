import React, { useState } from 'react';
import { clipboardHook, draggedTreeJSONNodeHook, popupFieldHook, sectionStateHook, treeHook } from '../../util/Atoms';
import { useRecoilState, useRecoilValue } from 'recoil';
import { Input, Button, message, Tooltip } from 'antd';
import { isObject } from '../../util/toColumn';
import { DeleteFilled } from '@ant-design/icons';

// TODO setting state may be able to be simplified

const ArraySubItem = ({ sectionDataTitle, arrayTitle, index, fieldName, characterLimit }) => {
  const [section, setSection] = useRecoilState(sectionStateHook);
  const [draggedTreeJSONNode, setDraggedTreeJSONNode] = useRecoilState(draggedTreeJSONNodeHook);
  const [popupField, setPopupField] = useRecoilState(popupFieldHook)
  const clipboard = useRecoilValue(clipboardHook)
  const [status, setStatus] = useState(null)

  const createSelf = (sectionTitle, arrayTitle, index, field, characterLimit) => {
    return (
      <div>
        <ArraySubItem sectionDataTitle={sectionTitle} arrayTitle={arrayTitle} index={index} fieldName={field} characterLimit={characterLimit}/>

      </div>
    )
  }

  const remove = () => {
    const newSection = { ...section };
    const newSectionItem = { ...newSection[sectionDataTitle] };
    const newArray = [...newSectionItem[arrayTitle]].filter((_, itemIndex) => index != itemIndex)
    console.log(newArray)
    newSectionItem[arrayTitle] = newArray;
    newSection[sectionDataTitle] = newSectionItem;
    setSection(newSection);
  };

  const update = (newValue) => {
    const newSection = { ...section };
    const newSectionItem = { ...newSection[sectionDataTitle] };
    const newArray = [...newSectionItem[arrayTitle]];
    const newArrayItem = { ...newArray[index], [fieldName]: newValue };
    newArray[index] = newArrayItem;
    newSectionItem[arrayTitle] = newArray;
    newSection[sectionDataTitle] = newSectionItem;
    setSection(newSection);
  };

  const append = (newValue) => {
    const newSection = { ...section };
    const newSectionItem = { ...newSection[sectionDataTitle] };
    const newArray = [...newSectionItem[arrayTitle]];
    const newArrayItem = { ...newArray[index], [fieldName]: newArray[index][fieldName] == "" ? newValue : `${newArray[index][fieldName]}${newValue}`};
    newArray[index] = newArrayItem;
    newSectionItem[arrayTitle] = newArray;
    newSection[sectionDataTitle] = newSectionItem;
    setSection(newSection);
  };
  
  const getValue = () => {
    if(typeof section[sectionDataTitle] == 'undefined') return ""
    if(typeof section[sectionDataTitle][arrayTitle] == 'undefined') return ""
    if(typeof section[sectionDataTitle][arrayTitle][index] == 'undefined') return ""
    if(typeof section[sectionDataTitle][arrayTitle][index][fieldName] == 'undefined') return ""
    return section[sectionDataTitle][arrayTitle][index][fieldName]
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
    <div style={{display: "flex", flexDiection : "row", alignItems: "center"}}>
      <Input.TextArea onContextMenu={rightClick} value={getValue()} onChange={(event) => update(event.target.value)} autoSize={{ minRows: 2, maxRows: 5 }}
        showCount={{formatter: showCount}} status={status}
        style={{width : "95%"}}
        onDragOver={(event) => { event.stopPropagation(); event.preventDefault();}} 
        onDrop={(event) => {
        const keys = Object.keys(draggedTreeJSONNode);
        // dragged node has one key and the value for that key is not an object
        if(!isObject(draggedTreeJSONNode)) 
          update(draggedTreeJSONNode);
        else setPopupField(createSelf(sectionDataTitle, arrayTitle, index, fieldName, characterLimit));
        }} 
      />
      <DeleteFilled onClick={remove} style={{ fontSize: '30px', color: 'red', paddingLeft : 10, paddingBottom: 20 }}  />
    </div>

  )
};

// lets array items be multi valued attributes
const ArrayItem = ({ sectionDataTitle, arrayTitle, index, fields, maxLength }) => {
  const renderArrayFields = () => {
    return fields.map(fieldname => (
      <ArraySubItem
        sectionDataTitle={sectionDataTitle}
        arrayTitle={arrayTitle}
        index={index}
        fieldName={fieldname}
        characterLimit={maxLength}
      />
    ));
  };

  return <div>{renderArrayFields()}</div>;
};

// array fields contain array items which could have multiple attributes and this multiple ArraySubItems
export const ArrayField = ({ sectionDataTitle, arrayTitle, fieldName, arrayMaxLength, fieldMaxLength}) => {
  const [section, setSection] = useRecoilState(sectionStateHook);
  const templateItem = {[fieldName] : ""}

  const getLength = () => {
    if (
      typeof section[sectionDataTitle] != 'undefined' &&
      typeof section[sectionDataTitle][arrayTitle] != 'undefined'
    ) {
      const arrayOfItems = section[sectionDataTitle][arrayTitle];
      return arrayOfItems.length;
    }
    return 0;
  };

  const renderArrayItems = () => {
    if (
      typeof section[sectionDataTitle] != 'undefined' &&
      typeof section[sectionDataTitle][arrayTitle] != 'undefined'
    ) {
      const arrayOfItems = section[sectionDataTitle][arrayTitle];
      return arrayOfItems.map((item, index) => (
        <ArrayItem
          sectionDataTitle={sectionDataTitle}
          arrayTitle={arrayTitle}
          index={index}
          fields={Object.keys(templateItem)}
          maxLength={fieldMaxLength}
        />
      ));
    }
  };

  const addItem = () => {
    const newSection = { ...section };
    if (typeof section[sectionDataTitle] == 'undefined')
      newSection[sectionDataTitle] = { [arrayTitle]: [templateItem] };
    else {
      const newSectionItem = { ...newSection[sectionDataTitle] };
      const newArray = [...newSectionItem[arrayTitle]];
      newArray.push(templateItem);
      newSectionItem[arrayTitle] = newArray;
      newSection[sectionDataTitle] = newSectionItem;
    }

    setSection(newSection);
  };

  return (
    <div>
      <p style={{color: getLength() > arrayMaxLength ? "red": "black"}}>{`${getLength()}/${arrayMaxLength}`}</p>
      <Button onClick={addItem}>Create Item</Button>
      {/* {getLength() > 0 ? (
        <Button onClick={removeItem}>Remove Last</Button>
      ) : null} */}
      {renderArrayItems()}



    </div>
  );
};
