import { useCallback, useState } from 'react';
import { getProjectById } from '../../../infra/rest/apis/project';
import { SelectedProjectAtom } from '../states';
import { useSetAtom } from 'jotai';
import useHome from '../../home/v1/hooks';
import useCommentsWrapper from '../../../shared/components/organisms/comments-wrapper/hooks';

const useProject = () => {
  const setSelectedProject = useSetAtom(SelectedProjectAtom);
  const { fetchProjectsByCategory } = useHome();
  const { fetchComments } = useCommentsWrapper();

  const [loading, setLoading] = useState(true);

  const fetchProject = useCallback(
    async (project_id: string) => {
      if (!project_id || project_id.trim() === '') return;

      try {
        const response = await getProjectById(project_id);
        if (response.data) {
          // Fetch comments for the project
          await fetchComments({ project_id: response.data._id || '' });
          setSelectedProject(response.data);

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
      }
    },
    [setSelectedProject, fetchProjectsByCategory, fetchComments]
  );

  return {
    loading,
    fetchComments,
    fetchProject,
  };
};

export default useProject;
