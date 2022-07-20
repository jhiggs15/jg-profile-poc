import React, { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { inputDataHook } from '../../util/Atoms';
import { pathToJSON } from '../../util/toJSON';
import { SkillsDisplay } from '../Data/SkillsDisplay';

export const SkillSection = ({title, schema, options}) => {
    const inputData = useRecoilValue(inputDataHook)

    const createSkillDisplay = () => {
        const allSkills = pathToJSON(options.allSkills.path, inputData)
        const JGSkills = pathToJSON(options.JGProjectSkills.path, inputData)
        const prevWorkSkills = pathToJSON(options.prevWorkSkills.path, inputData)

        const sectionDataTitle = Object.keys(schema)[0]
        const sectionSchema = schema[sectionDataTitle].schema

        const arrayTitle = Object.keys(sectionSchema)[0]
        const arrayTitleSchema = sectionSchema[arrayTitle].schema
        const arrayMaxLength = sectionSchema[arrayTitle].maxLength

        const fieldName = Object.keys(arrayTitleSchema)[0]
        const fieldNameSchema = arrayTitleSchema[fieldName]
        const fieldNameMaxLength = fieldNameSchema.maxLength

        return (
          <SkillsDisplay allSkills={allSkills} 
            JGProjects={{companyName: options.JGProjectSkills.companyName, skills: options.JGProjectSkills.skills, data: JGSkills}} 
            prevWork={{companyName: options.prevWorkSkills.companyName, skills: options.prevWorkSkills.skills, data: prevWorkSkills}} 
            sectionDataTitle={sectionDataTitle} 
            arrayTitle={arrayTitle} arrayMaxLength={arrayMaxLength}
            fieldName={fieldName} fieldNameMaxLength={fieldNameMaxLength}
          />
        )
    }

    return (
        <div>
            <h1 style={{textAlign: "center"}}>{title}</h1>
            {createSkillDisplay()}
        </div>
    )

}