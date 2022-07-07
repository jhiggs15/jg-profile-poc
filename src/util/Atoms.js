import { atom } from 'recoil';

export const sectionStateHook = atom({
  key: 'sectionState',
  default: {},
});
export const nameHook = atom({
  key: 'nameState',
  default: '',
});
export const tokenHook = atom({
  key: 'tokenState',
  default: '',
});
export const templateIDHook = atom({
  key: 'templateState',
  default: '',
});
export const documentIDHook = atom({
  key: 'documentState',
  default: '',
});
export const previewURLHook = atom({
  key: 'previewState',
  default: '',
});
