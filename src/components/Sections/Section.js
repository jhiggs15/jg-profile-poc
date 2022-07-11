import React from "react";
import { ArrayField } from "../Fields/ArrayField";
import { Field } from "../Fields/Field";
import { inputDataHook, sectionStateHook } from "../../util/Atoms";
import { useRecoilValue, useRecoilState } from "recoil";
 
export const Section = ({title, schema}) => {
   const inputData = useRecoilValue(inputDataHook)
   const [section, setSection] = useRecoilState(sectionStateHook)
 
   const createSectionFields = () => {
       return Object.keys(schema).map((fieldName) => {
         const field = schema[fieldName];
         if (Array.isArray(field))
           return <ArrayField sectionTitle={title} title={fieldName} templateItem={field[0]} />;
         else {
           return <Field defaultValue={inputData[fieldName] ?? ""} sectionTitle={title} title={fieldName} />;
         }
       });
   };
 
   return(
       <div>
           <h1>{title}</h1>
           {createSectionFields()}
       </div>
   )
 
}

