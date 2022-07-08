import React, { useState } from 'react';

export const Field = ({title}) => {
  const newTitle =   `Field ${title}`

  return(
    <h1>{newTitle}</h1>
  )
}