export const templateInfo = (tempalteID, name) => {
  return (
    {
      document: {
        document_template_id: tempalteID,
        meta: { _filename: name + " profile-poc" },
      }
    }
  )

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
      status: "pending",
    },
  };
};

export const headerInfo = {
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'Bearer RWKT_XJherzUoV3cDYyx',
  },
};
