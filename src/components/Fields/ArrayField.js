import React, { useState } from 'react';
import { draggedTreeJSONNodeHook, popupFieldHook, sectionStateHook, treeHook } from '../../util/Atoms';
import { useRecoilState } from 'recoil';
import { Input, Button } from 'antd';
import { isObject } from '../../util/TreeNodeToColumn';

// TODO setting state may be able to be simplified

const ArraySubItem = ({ sectionTitle, title, index, field }) => {
  const [section, setSection] = useRecoilState(sectionStateHook);
  const [draggedTreeJSONNode, setDraggedTreeJSONNode] = useRecoilState(draggedTreeJSONNodeHook);
  const [popupField, setPopupField] = useRecoilState(popupFieldHook)


  const createSelf = (sectionTitle, title, index, field) => {
    return (
      <div>
        <h1>{sectionTitle}</h1>
        <h1>{`${title} : ${field}`}</h1>
        <ArraySubItem sectionTitle={sectionTitle} title={title} index={index} field={field}/>

      </div>
    )

  }

  const update = (newValue) => {
    const newSection = { ...section };
    const newSectionItem = { ...newSection[sectionTitle] };
    const newArray = [...newSectionItem[title]];
    const newArrayItem = { ...newArray[index], [field]: newValue };
    newArray[index] = newArrayItem;
    newSectionItem[title] = newArray;
    newSection[sectionTitle] = newSectionItem;
    setSection(newSection);
  };
  
  const getValue = () => {
    if(typeof section[sectionTitle] == 'undefined') return ""
    if(typeof section[sectionTitle][title] == 'undefined') return ""
    if(typeof section[sectionTitle][title][index] == 'undefined') return ""
    if(typeof section[sectionTitle][title][index][field] == 'undefined') return ""
    return section[sectionTitle][title][index][field]
  }

  return (
    <Input.TextArea value={getValue()} onChange={(event) => update(event.target.value)} autoSize={{ minRows: 2, maxRows: 5 }}
      onDragOver={(event) => { event.stopPropagation(); event.preventDefault();}} 
      onDrop={(event) => {
      const keys = Object.keys(draggedTreeJSONNode);
      // dragged node has one key and the value for that key is not an object
      if (keys.length == 1 && !isObject(draggedTreeJSONNode[keys[0]])){
        update(draggedTreeJSONNode[keys[0]]);
        // todo probably reset treeNode
      }
      else setPopupField(createSelf(sectionTitle, title, index, field));
      }} 
    />
  )
};

// lets array items be multi valued attributes
const ArrayItem = ({ sectionTitle, title, index, fields }) => {
  const renderArrayFields = () => {
    return fields.map((field) => (
      <ArraySubItem
        sectionTitle={sectionTitle}
        title={title}
        index={index}
        field={field}
      />
    ));
  };

  return <div>{renderArrayFields()}</div>;
};

// array fields contain array items which could have multiple attributes and this multiple ArraySubItems
export const ArrayField = ({ sectionTitle, title, templateItem }) => {
  const newTitle = `Array Field ${title}`;
  const [section, setSection] = useRecoilState(sectionStateHook);

  const getLength = () => {
    if (
      typeof section[sectionTitle] != 'undefined' &&
      typeof section[sectionTitle][title] != 'undefined'
    ) {
      const arrayOfItems = section[sectionTitle][title];
      return arrayOfItems.length;
    }
    return 0;
  };

  const renderArrayItems = () => {
    if (
      typeof section[sectionTitle] != 'undefined' &&
      typeof section[sectionTitle][title] != 'undefined'
    ) {
      const arrayOfItems = section[sectionTitle][title];
      return arrayOfItems.map((item, index) => (
        <ArrayItem
          sectionTitle={sectionTitle}
          title={title}
          index={index}
          fields={Object.keys(templateItem)}
        />
      ));
    }
  };

  const addItem = () => {
    const newSection = { ...section };
    if (typeof section[sectionTitle] == 'undefined')
      newSection[sectionTitle] = { [title]: [templateItem] };
    else {
      const newSectionItem = { ...newSection[sectionTitle] };
      const newArray = [...newSectionItem[title]];
      newArray.push(templateItem);
      newSectionItem[title] = newArray;
      newSection[sectionTitle] = newSectionItem;
    }

    setSection(newSection);
  };

  const removeItem = () => {
    const newSection = { ...section };
    const newSectionItem = { ...newSection[sectionTitle] };
    const newArray = [...newSectionItem[title]];
    newArray.pop(templateItem);
    newSectionItem[title] = newArray;
    newSection[sectionTitle] = newSectionItem;
    setSection(newSection);
  };

  return (
    <div>
      <h1>{newTitle}</h1>
      {renderArrayItems()}
      {getLength() > 0 ? (
        <Button onClick={removeItem}>Remove Last</Button>
      ) : null}

      <Button onClick={addItem}>Create Item</Button>
    </div>
  );
};
