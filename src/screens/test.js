import React, { useState } from 'react';
import { Field } from '../components/Fields/Field';
import { ArrayField } from '../components/Fields/ArrayField';
import { templateStructure } from '../templateStructure';


const createSectionFields = (schema) =>{
  return Object.keys(schema).map(fieldName => {
    const field = schema[fieldName]
    if(Array.isArray(field)) return <ArrayField title={fieldName} />
    else return <Field title={fieldName} />

  })


}

const createSections = (templateStructure) => {
  return Object.keys(templateStructure).map(sectionTitle => {
    const section = templateStructure[sectionTitle]
    // create sections here
    switch(section.type) {
      case "Autofill":
      case "ShowData":
      case "Transfer" :
      default:
        return (
          <div> 
            {createSectionFields(section.schema)}
          </div>
        )


    }

  })

};

export const Test = () => {

  return (
    <> 
      {createSections(templateStructure)}

    </>
  )
}