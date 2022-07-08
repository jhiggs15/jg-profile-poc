import React, { useState } from 'react';
import "./Document.css"

export const Document = ({previewURL}) => {

  return (
    <div class="wrap"> 
      <iframe class="frame" src={previewURL} />
    </div>
  )
};
