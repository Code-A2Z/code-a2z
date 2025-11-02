import { useState } from 'react';
import { useAtom } from 'jotai';
import { EditorPageAtom, EditorPageState } from '../states';

export const useEditor = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [editorPageState, setEditorPageState] = useAtom(EditorPageAtom);

  const handlePublish = () => setEditorPageState(EditorPageState.PUBLISH);
  const handleBackToEditor = () => setEditorPageState(EditorPageState.EDITOR);

  return {
    loading,
    setLoading,
    editorPageState,
    setEditorPageState,
    handlePublish,
    handleBackToEditor,
  };
};
