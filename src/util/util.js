export const createTemplateInfo = (tempalteID, name) => {
  return {
    document: {
      document_template_id: tempalteID,
      meta: { _filename: 'Profile-POC' },
    },
  };
};

// UPDATING PDF template or file name causes preview url to error temporarily
export const createRequest = (data) => {
  return {
    document: {
      payload: data,
    },
  };
};

export const createPublishRequest = () => {
  return {
    document: {
      status: 'pending',
    },
  };
};

export const createHeaderInfo = (token) => {
  return {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };
};
