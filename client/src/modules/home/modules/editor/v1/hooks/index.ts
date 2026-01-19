import { useAtom } from 'jotai';
import { EditorPageAtom, EditorPageState } from '../states';

export const useEditor = () => {
  const [editorPageState, setEditorPageState] = useAtom(EditorPageAtom);

  const handlePublish = () => setEditorPageState(EditorPageState.PUBLISH);
  const handleBackToEditor = () => setEditorPageState(EditorPageState.EDITOR);

  return {
    editorPageState,
    setEditorPageState,
    handlePublish,
    handleBackToEditor,
  };
};
