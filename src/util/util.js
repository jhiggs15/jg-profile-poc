export const templateInfo = {
  document: {
    document_template_id: '35A8E8B5-3CC2-43CF-B4DB-F8E139031518',
    meta: { _filename: 'some-custom-name.pdf' },
  },
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
