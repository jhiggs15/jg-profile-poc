import React, { useState } from 'react';

export const ArrayField = ({ title }) => {
  const newTitle = `Array Field ${title}`;

  return (
    <div>
      <h1>{newTitle}</h1>
    </div>
  );
};
