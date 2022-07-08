import { atom } from 'recoil';
import { queryToTree } from './QueryToTree';
import { getUser } from '../getUserQuery';

export const sectionStateHook = atom({
  key: 'sectionState',
  default: {},
});

export const treeHook = atom({
  key: 'treeState',
  default: queryToTree(getUser),
});

export const nameHook = atom({
  key: 'nameState',
  default: '',
});
export const tokenHook = atom({
  key: 'tokenState',
  default: 'RWKT_XJherzUoV3cDYyx',
});
export const templateIDHook = atom({
  key: 'templateState',
  default: '',
});
export const documentIDHook = atom({
  key: 'documentState',
  default: 'C1796521-EDD6-4E1C-95FE-2F9204680110',
});
export const previewURLHook = atom({
  key: 'previewState',
  default:
    'https://preview.pdfmonkey.io/pdf/web/viewer.html?file=https%3A%2F%2Fpreview.pdfmonkey.io%2Fdocument-render%2Fc1796521-edd6-4e1c-95fe-2f9204680110%2F2baa5537329086beb0ed2498944bcff2',
});
