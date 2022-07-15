
import React from "react"
import { Table } from 'antd';

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


export const SkillsDisplay = ({allSkills, JGProjects, prevWork}) => {

    console.log(allSkills)
    console.log(JGProjects)
    console.log(prevWork)

    const vals = combineSkillsData(allSkills, JGProjects, prevWork)

    const columns = [
        {title: "Skill Name", dataIndex: "name"}, 
        {title: "Category", dataIndex: "category"},
        {title: "Proficency", dataIndex: "rating"},
        {title: "Previous Work Experiennce", dataIndex: "prevWork"},
        {title: "JG Experiennce", dataIndex: "JGProjects"},
    ]

    return (
        <div>
            {/* {JSON.stringify(JGProjects)} */}
            {/* {JSON.stringify(vals)} */}
            {/* {JSON.stringify(prevWork)} */}
            <Table dataSource={vals} columns={columns} />
            {/* {JSON.stringify(JGProjects)}
             */}

        </div>
    )


}