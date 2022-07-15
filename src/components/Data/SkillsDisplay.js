
import React, { useState } from "react"
import { Table } from 'antd';
import { useRecoilState } from "recoil";
import { sectionStateHook } from "../../util/Atoms";

/**
 * name
 * description
 * imageLink
 * category
 * rating
 */

const iterateWorkData = (workDatas, workDataAttribute, companyNameAttribute, skillsAttribute, map) => {
    for(let workData of workDatas) {
        const name = workData[companyNameAttribute]
        for(let skill of workData[skillsAttribute]) {
            let foundSkill = map.get(skill.name)
            if(typeof foundSkill == 'undefined') 
            foundSkill = createNewSkillItem(skill.name, skill.rating, skill.category[0].value, map)
            foundSkill[workDataAttribute].push(name)
        }

    }

}

const ratingToString = (rating) => {
    if(rating <= 1) return "Knowlegeable"
    else if(rating == 2) return "Knowlegeable"
    else if(rating >= 3) return "Lead/Teach"

}

const createNewSkillItem = (name, rating, category, map) => {
    const skill = {name, rating: ratingToString(rating), category}
    skill.key = name
    skill["JGProjects"] = []
    skill["prevWork"] = []
    map.set(name, skill)
    return skill
}

export const combineSkillsData = (allSkills, JGProjects, prevWork) => {
    const map = new Map()

    allSkills.forEach(skill => {
        createNewSkillItem(skill.name, skill.rating, skill.category[0].value, map)

    })

    iterateWorkData(JGProjects.data, "JGProjects", JGProjects.companyName, JGProjects.skills, map)
    iterateWorkData(prevWork.data, "prevWork", prevWork.companyName, prevWork.skills, map)

    return Array.from(map.values())    
}


export const SkillsDisplay = ({allSkills, JGProjects, prevWork, sectionItemKey, sectionTitle, title}) => {
    const [section, setSection] = useRecoilState(sectionStateHook);

    const removeItem = (index) => {
        const newSection = { ...section };

        const newSectionItem = { ...newSection[sectionTitle] };
        const newArray = [...newSectionItem[title]].filter((item, oldIndex) => index != oldIndex)
        newSectionItem[title] = newArray;
        newSection[sectionTitle] = newSectionItem;
        setSection(newSection)
    }
    
    const addItems = (values) => {
        const newSection = { ...section };

        const newSectionItem = { ...newSection[sectionTitle] };
        const newArray = [];
        values.forEach((value) => {
            newArray.push({[sectionItemKey] : value})
        })
        newSectionItem[title] = newArray;
        newSection[sectionTitle] = newSectionItem;

        setSection(newSection);
    }

    const handleChange = (selectedRowKeys) => {
        addItems(selectedRowKeys)
    };


    const vals = combineSkillsData(allSkills, JGProjects, prevWork)

    const columns = [
        {title: "Skill Name", dataIndex: "name"}, 
        {title: "Category", dataIndex: "category"},
        {title: "Proficency", dataIndex: "rating"},
        {title: "Previous Work Experiennce", dataIndex: "prevWork"},
        {title: "JG Experiennce", dataIndex: "JGProjects"},
    ]

    const rowSelection = {
        type: 'checkbox',
        onChange: handleChange,
        getCheckboxProps: (record) => ({ name: record.name }),
        selectedRowKeys: section[sectionTitle][title].map(item => {
            return item[sectionItemKey]
        })
      };

    return (
        <div>
            <Table
                rowSelection={{...rowSelection}}
                dataSource={vals} columns={columns} />
        </div>
    )


}