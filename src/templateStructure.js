export const templateStructure = {
  userinfo: {
    type: 'Autofill',
    schema: {
      name: '',
      title: '',
      funfact: '',
      school: '',
      degree: '',
    },
  },
  experience: {
    type: 'ShowData',
    schema: {
      experienceList: [{ experienceItem: '' }],
    },
  },
  skills: {
    type: 'Transfer',
    schema: {
      skillList: [{ skillName: '' }],
    },
  },
};
