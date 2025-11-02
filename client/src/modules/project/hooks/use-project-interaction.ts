import { useAtom } from 'jotai';
import { useAuth } from '../../../shared/hooks/use-auth';
import { LikedByUserAtom, SelectedProjectAtom } from '../states';
import { useNotifications } from '../../../shared/hooks/use-notification';
import { likeProject } from '../../../infra/rest/apis/like';

const useProjectInteraction = () => {
  const { isAuthenticated } = useAuth();
  const [project, setProject] = useAtom(SelectedProjectAtom);
  const [islikedByUser, setLikedByUser] = useAtom(LikedByUserAtom);
  const { addNotification } = useNotifications();

  const handleLike = async () => {
    if (!project?._id || !isAuthenticated()) {
      return addNotification({
        message: 'Please login to like this project',
        type: 'error',
      });
    }

    try {
      await likeProject({
        project_id: project._id,
        is_liked_by_user: islikedByUser,
      });
      setLikedByUser(prevVal => !prevVal);
      const newTotalLikes = !islikedByUser
        ? (project.activity.total_likes || 0) + 1
        : (project.activity.total_likes || 0) - 1;

      setProject({
        ...project,
        activity: {
          ...project.activity,
          total_likes: newTotalLikes,
        },
      });
    } catch (error) {
      addNotification({
        message: 'Please login to like this project',
        type: 'error',
      });
      console.error('Like error:', error);
    }
  };

  return {
    handleLike,
  };
};

export default useProjectInteraction;
