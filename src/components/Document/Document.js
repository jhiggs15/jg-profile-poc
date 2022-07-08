import React, { useState } from 'react';
import "./Document.css"

export const Document = ({previewURL}) => {
  console.log("Hello World")

  return (
    <div class="wrap"> 
      <iframe class="frame" src={previewURL} />
    </div>
  )
};
