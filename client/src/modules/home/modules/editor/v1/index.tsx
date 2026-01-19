import { EditorPageState } from './states';
import ProjectEditor from './components/project-editor';
import PublishForm from './components/publish-form';
import { useEditor } from './hooks';

const Editor = () => {
  const { editorPageState } = useEditor();

  if (editorPageState === EditorPageState.PUBLISH) {
    return <PublishForm />;
  }

  return <ProjectEditor />;
};

export default Editor;
