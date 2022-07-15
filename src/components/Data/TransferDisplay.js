import React, { useState } from "react";
import { Transfer, List } from 'antd';
import { constSelector, useRecoilState } from "recoil";
import { sectionStateHook } from "../../util/Atoms";
import { hasClientExports } from "@apollo/client/utilities";


export const TransferDisplay = ({data, style, sectionTitle, title, fieldName}) => {
    const [selectedKeys, setSelectedKeys] = useState([]);
    const [section, setSection] = useRecoilState(sectionStateHook);
    const [targetKeys, setTargetKeys] = useState(section[sectionTitle][title].filter(item => item[fieldName] != "").map(item => item.key));

    const handleSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
        setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
      };

    const addItems = (values, indexes) => {
        const newSection = { ...section };

        const newSectionItem = { ...newSection[sectionTitle] };
        const newArray = [...newSectionItem[title]];
        values.forEach((value, index) => {
            newArray[indexes[index]] = value
        })
        newSectionItem[title] = newArray;
        newSection[sectionTitle] = newSectionItem;

        setSection(newSection);
    }

    const addItem = (value, index) => {
        const newSection = { ...section };

        const newSectionItem = { ...newSection[sectionTitle] };
        const newArray = [...newSectionItem[title]];
        newArray[index] = value
        newSectionItem[title] = newArray;
        newSection[sectionTitle] = newSectionItem;

        setSection(newSection);
    };

    const removeItem = (index) => {
        const newSection = { ...section };

        const newSectionItem = { ...newSection[sectionTitle] };
        const newArray = [...newSectionItem[title]].filter((item, oldIndex) => index != oldIndex)
        newSectionItem[title] = newArray;
        newSection[sectionTitle] = newSectionItem;
        setSection(newSection)
    }
    

    const handleChange = (newTargetKeys, direction, moveKeys) => {
        if(direction == 'right') {
            addItems(moveKeys.map(key => data[key]), moveKeys.map((_, index) => targetKeys.length + index))
        }
        else {
            // should only run once
            moveKeys.forEach(index => {
                removeItem(targetKeys.indexOf(index))
            });
        }

        setTargetKeys(newTargetKeys);      
  
    };


    return (
        <Transfer 
        listStyle={{width: "100%",height: "50vh",}} oneWay showSearch titles={['Input Data', 'Output Data']} selectedKeys={selectedKeys} targetKeys={targetKeys} dataSource={data} 
            onChange={handleChange} onSelectChange={handleSelectChange} render={item => item[fieldName]} 
        />


    )
}