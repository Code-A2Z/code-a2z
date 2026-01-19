import { atom } from 'jotai';
import EditorJS, { OutputData } from '@editorjs/editorjs';

export enum EditorPageState {
  EDITOR = 'editor',
  PUBLISH = 'publish',
}

export interface EditorContent {
  title: string;
  description: string;
  banner: string;
  content: OutputData[] | OutputData;
  tags: string[];
  liveURL: string;
  repositoryURL: string;
}

export const DEFAULT_EDITOR_CONTENT: EditorContent = {
  title: '',
  description: '',
  banner: '',
  content: { blocks: [] },
  tags: [],
  liveURL: '',
  repositoryURL: '',
};

export const EditorPageAtom = atom<EditorPageState>(EditorPageState.EDITOR);

export const TextEditorAtom = atom<{ isReady: boolean; editor?: EditorJS }>({
  isReady: false,
});

export const EditorContentAtom = atom<EditorContent>(DEFAULT_EDITOR_CONTENT);
