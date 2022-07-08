import React, { useState } from 'react';
import { Input, Tree } from 'antd';
import { useRecoilState } from 'recoil';
import { sectionStateHook, treeHook } from '../../util/Atoms';

export const Field = ({sectionTitle, title}) => {
  const newTitle =   `Field ${title}`
  const [section, setSection] = useRecoilState(sectionStateHook)

  const update = (newValue) => {
    const newSection = {...section}
    const newField = {[title] : newValue}
    newSection[sectionTitle] = newField
    setSection(newSection)
  }

  return (
    <div>
      <h1>{newTitle}</h1>
      <Input
        onChange={event => update(event.target.value)}

       />
    </div>
  );
}