import { useCallback, useState, useRef } from 'react';
import { getProjectById } from '../../../../../../infra/rest/apis/project';
import { SelectedProjectAtom } from '../states';
import { useSetAtom } from 'jotai';
import useHomeV1 from '../../../../v1/hooks';
import useCommentsWrapper from '../../../../../../shared/components/organisms/comments-wrapper/hooks';

const useProject = () => {
  const setSelectedProject = useSetAtom(SelectedProjectAtom);
  const { fetchProjectsByCategory } = useHomeV1();
  const { fetchComments } = useCommentsWrapper();

  const [loading, setLoading] = useState(true);
  const currentProjectIdRef = useRef<string | null>(null);

  const fetchProject = useCallback(
    async (project_id: string) => {
      if (!project_id || project_id.trim() === '') {
        setLoading(false);
        return;
      }

      // Prevent fetching the same project multiple times
      if (currentProjectIdRef.current === project_id) {
        return;
      }

      currentProjectIdRef.current = project_id;
      setLoading(true);

      try {
        const response = await getProjectById(project_id);
        if (response.data) {
          setSelectedProject(response.data);

          // Fetch comments for the project (reset comments for new project)
          await fetchComments({
            project_id: response.data._id || '',
            reset: true,
          });

          // Fetch similar projects
          if (response.data.tags && response.data.tags.length > 0) {
            await fetchProjectsByCategory({
              tag: response.data.tags[0],
              limit: 5,
              rmv_project_by_id: project_id,
            });
          }

          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching project:', error);
        setLoading(false);
        currentProjectIdRef.current = null;
      }
    },
    [setSelectedProject, fetchProjectsByCategory, fetchComments]
  );

  return {
    loading,
    fetchProject,
  };
};

export default useProject;
