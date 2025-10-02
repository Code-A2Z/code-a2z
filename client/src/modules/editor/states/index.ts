import { atom } from 'jotai';
import type EditorJS from '@editorjs/editorjs';
import { EditorMode } from '../typings';

export const EditorAtom = atom<EditorMode>(EditorMode.EDITOR);

export const TextEditorAtom = atom<{ isReady: boolean; editor?: EditorJS }>({
  isReady: false,
});
