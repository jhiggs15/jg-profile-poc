export const templateStructure = {
  userinfo: {
    sectionType: 'Autofill',
    schema: {
      name: '',
      title: '',
      funfact: '',
      school: '',
      degree: '',
    },
  },
  experience: {
    sectionType: 'ShowData',
    schema: {
      experienceList: [{ experienceItem: '' }],
    },
  },
  skills: {
    sectionType: 'Transfer',
    schema: {
      skillList: [{ skillName: '' }],
    },
  },
};
