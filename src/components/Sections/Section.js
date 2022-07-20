import React from "react";
import { ArrayField } from "../Fields/ArrayField";
import { Field } from "../Fields/Field";
import { inputDataHook, sectionStateHook } from "../../util/Atoms";
import { useRecoilValue, useRecoilState } from "recoil";
import { TreeDisplay } from "../Data/Tree/TreeDisplay";
 
export const Section = ({title, schema}) => {
   const inputData = useRecoilValue(inputDataHook)
   const [section, setSection] = useRecoilState(sectionStateHook)
 
   const createSectionFields = () => {
    const sectionDataTitle = Object.keys(schema)[0]
    const sectionSchema = schema[sectionDataTitle].schema
    return Object.keys(sectionSchema).map(fieldName => {
      const field = sectionSchema[fieldName];
      console.log(field)
      if (Array.isArray(field)) return (<h1>Need to reimplement array field in section</h1>)
        // return <ArrayField sectionTitle={title} title={fieldName} templateItem={field[0]} />;
      else {
        return <Field characterLimit={field.maxLength} key={sectionDataTitle+fieldName} title={field.title} sectionDataTitle={sectionDataTitle} fieldName={fieldName} />;
      }
    });
   };
 
   return(
    <div style={{display: "flex", flexDirection: "row"}}>
      <TreeDisplay />
      <div style={{width: "100%"}}>
        <h1 style={{textAlign: "center"}}>{title}</h1>
        {createSectionFields()}
      </div>
    </div>
   )
 
}

