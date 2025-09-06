import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ProjectAtom } from "../../../shared/states/project";
import { UserAtom } from "../../../shared/states/user";
import { likeNotification, likeStatus } from "../requests";
import { useNotifications } from "../../../shared/hooks/use-notification";
import { CommentsWrapperAtom, LikedByUserAtom } from "../states";

const ProjectInteraction = () => {
  const [project, setProject] = useAtom(ProjectAtom);
  const user = useAtomValue(UserAtom);
  const [islikedByUser, setLikedByUser] = useAtom(LikedByUserAtom);
  const setCommentsWrapper = useSetAtom(CommentsWrapperAtom);
  const { addNotification } = useNotifications();

  useEffect(() => {
    const fetchLikeStatus = async () => {
      if (!project?._id || !user?.access_token) return;
      try {
        const response = await likeStatus({ _id: project._id });
        if (response.isLiked) {
          setLikedByUser(Boolean(response.isLiked));
        }
      } catch (error) {
        console.error("Error fetching like status:", error);
      }
    };
    fetchLikeStatus();
  }, [project?._id]);

  const handleLike = async () => {
    if (!project?._id || !user?.access_token) {
      return addNotification({
        message: "Please login to like this project",
        type: "error"
      });
    }
    
    try {
      await likeNotification({ _id: project._id, islikedByUser });
      setLikedByUser(prevVal => !prevVal);
      const newTotalLikes = !islikedByUser 
        ? (project.activity.total_likes || 0) + 1 
        : (project.activity.total_likes || 0) - 1;
      
      setProject({ 
        ...project, 
        activity: { 
          ...project.activity, 
          total_likes: newTotalLikes 
        } 
      });
    } catch (error) {
      addNotification({
        message: "Please login to like this project",
        type: "error"
      });
    }
  }

  return (
    <>
      <hr className="border-gray-200 my-2" />

      <div className="flex gap-6 justify-between">
        <div className="flex gap-3 items-center">
          <button
            onClick={handleLike}
            className={
              "w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-200 " +
              (islikedByUser
                ? "bg-red-100 text-red-500 dark:bg-red-200 dark:text-red-600"
                : "bg-gray-100 text-gray-600 dark:bg-[#27272a] dark:text-gray-300")
            }
          >
            <i className={"fi " + (islikedByUser ? "fi-sr-heart" : "fi-rr-heart")}></i>
          </button>
          <p className="text-xl text-gray-700 dark:text-gray-300">{project?.activity.total_likes}</p>

          <button
            onClick={() => setCommentsWrapper(preVal => !preVal)}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-200 bg-gray-100 text-gray-600 dark:bg-[#27272a] dark:text-gray-300"
          >
            <i className="fi fi-rr-comment-dots"></i>
          </button>
          <p className="text-xl text-gray-700 dark:text-gray-300">{project?.activity.total_comments}</p>
        </div>

        <div className="flex gap-6 items-center">

          {
            user?.username === project?.author.personal_info.username ?
              <Link to={`/editor/${project?.project_id}`} className="underline hover:text-purple">Edit</Link> :
              ""
          }

          <Link to={`https://twitter.com/intent/tweet?text=Read ${project?.title}&url=${location.href}`}>
            <i className="fi fi-brands-twitter text-xl hover:text-[#1DA1F2]"></i>
          </Link>
        </div>
      </div>

      <hr className="border-gray-200 my-2" />
    </>
  )
}

export default ProjectInteraction;
