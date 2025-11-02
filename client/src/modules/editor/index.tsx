import { Navigate } from 'react-router-dom';
import { useAuth } from '../../shared/hooks/use-auth';
import { EditorPageState } from './states';
import { CircularProgress } from '@mui/material';
import ProjectEditor from './components/project-editor';
import PublishForm from './components/publish-form';
import { useEditor } from './hooks';

const Editor = () => {
  const { isAuthenticated, initialized } = useAuth();
  const { loading, editorPageState } = useEditor();

  if (!initialized || loading) return <CircularProgress />;
  if (!isAuthenticated()) return <Navigate to="/login" />;

  return editorPageState === EditorPageState.EDITOR ? (
    <ProjectEditor />
  ) : editorPageState === EditorPageState.PUBLISH ? (
    <PublishForm />
  ) : undefined;
};

export default Editor;
