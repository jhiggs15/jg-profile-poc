import React, { useEffect, useState } from 'react';
import { Input } from 'antd';

export const ArrayField = ({ title, field, handleFieldChange }) => {
  return (
    <>
      <h2>{title}</h2>
      <Input
        value={field}
        autoSize={{ minRows: 3, maxRows: 5 }}
        onChange={(event) => handleFieldChange(title, event.target.value)}
      />
    </>
  );
};
