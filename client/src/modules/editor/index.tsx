import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import ProjectEditor from "./components/projectEditor";
import PublishForm from "./components/publishForm";
import Loader from "../../shared/components/atoms/loader";
import { useAtomValue, useSetAtom } from "jotai";
import { UserAtom } from "../../shared/states/user";
import { EditorAtom } from "./states";
import { ProjectAtom } from "../../shared/states/project";
import { getProject } from "../project/requests";

const Editor = () => {
  const { project_id } = useParams();
  const user = useAtomValue(UserAtom);

  const setProject = useSetAtom(ProjectAtom);
  const editorState = useAtomValue(EditorAtom);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!project_id) {
      setLoading(false);
      return;
    }

    const fetchProject = async () => {
      const response = await getProject({ project_id, draft: true, mode: 'edit' });
      if (response.project) {
        setProject(response.project);
      } else {
        setProject(null);
      }
      setLoading(false);
    };

    fetchProject();
  }, []);

  if (!user?.access_token) {
    return <Navigate to="/login" />;
  }

  if (loading) {
    return <Loader />;
  }

  return (
    editorState === "editor" ? (
      <ProjectEditor />
    ) : (
      <PublishForm />
    )
  );
}

export default Editor;
