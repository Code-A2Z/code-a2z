import { useState } from "react";
import { getDay } from "../../../shared/utils/date";
import CommentField from "./commentField";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { UserAtom } from "../../../shared/states/user";
import { ProjectAtom } from "../../../shared/states/project";
import { useNotifications } from "../../../shared/hooks/use-notification";
import { TotalParentCommentsLoadedAtom } from "../states";
import { Comment } from "../../../shared/typings";
import { getReplies, deleteComment } from "../requests";

const CommentCard = ({
  index,
  leftVal,
  commentData,
}: {
  index: number;
  leftVal: number;
  commentData: Comment & {
    commented_by?: {
      personal_info: {
        profile_img: string;
        fullname: string;
        username: string;
      };
    };
    childrenLevel?: number;
    isReplyLoaded?: boolean;
  };
}) => {
  const user = useAtomValue(UserAtom);
  const [project, setProject] = useAtom(ProjectAtom);
  const setTotalParentCommentsLoaded = useSetAtom(TotalParentCommentsLoadedAtom);
  const { addNotification } = useNotifications();

  const [isReplying, setReplying] = useState(false);

  if (!project) return null;

  const { 
    commented_by, 
    commentedAt, 
    comment, 
    _id, 
    children = [],
    childrenLevel = 0,
    isReplyLoaded = false
  } = commentData;

  const { 
    personal_info: { 
      profile_img, 
      fullname: commented_by_fullname, 
      username: commented_by_username 
    } 
  } = commented_by || { personal_info: { profile_img: '', fullname: '', username: '' } };

  const { comments, activity } = project;
  const commentsArr = comments?.results || [];
  const total_parent_comments = activity?.total_parent_comments || 0;

  const getParentIndex = (): number | undefined => {
    let startingPoint = index - 1;

    try {
      while (startingPoint >= 0 && commentsArr[startingPoint] && (commentsArr[startingPoint]?.childrenLevel ?? 0) >= childrenLevel) {
        startingPoint--;
      }
    } catch {
      return undefined;
    }

    return startingPoint >= 0 ? startingPoint : undefined;
  };

  const removeCommentsCards = (startingPoint: number, isDelete = false) => {
    const newCommentsArr = [...commentsArr];
    
    if (newCommentsArr[startingPoint]) {
      while (newCommentsArr[startingPoint] && (newCommentsArr[startingPoint]?.childrenLevel ?? 0) > childrenLevel) {
        newCommentsArr.splice(startingPoint, 1);
        if (!newCommentsArr[startingPoint]) {
          break;
        }
      }
    }

    if (isDelete) {
      let parentIndex = getParentIndex();

      if (parentIndex !== undefined && newCommentsArr[parentIndex]) {
        const parentComment = newCommentsArr[parentIndex];
        if (parentComment) {
          parentComment.children = parentComment.children.filter(child => child !== _id);

          if (!parentComment.children.length) {
            (parentComment as any).isReplyLoaded = false;
          }
        }
      }

      newCommentsArr.splice(index, 1);
    }

    if (childrenLevel === 0 && isDelete) {
      setTotalParentCommentsLoaded(prevVal => prevVal - 1);
    }

    setProject({ 
      ...project, 
      comments: { results: newCommentsArr }, 
      activity: { 
        ...activity, 
        total_parent_comments: total_parent_comments - (childrenLevel === 0 && isDelete ? 1 : 0) 
      } 
    });
  };

  const loadReplies = async ({ skip = 0, currentIndex = index }: { skip?: number; currentIndex?: number }) => {
    if (!commentsArr[currentIndex]?.children.length) return;

    hideReplies();

    try {
      const response = await getReplies({ _id: commentsArr[currentIndex]._id, skip });

      const newCommentsArr = [...commentsArr];
      (newCommentsArr[currentIndex] as any).isReplyLoaded = true;

      for (let i = 0; i < response.replies.length; i++) {
        response.replies[i].childrenLevel = (commentsArr[currentIndex]?.childrenLevel || 0) + 1;
        newCommentsArr.splice(currentIndex + 1 + i + skip, 0, response.replies[i]);
      }

      setProject({ ...project, comments: { ...comments, results: newCommentsArr } });
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteComment = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const target = e.target as HTMLButtonElement;
    target.setAttribute("disabled", "true");

    try {
      await deleteComment({ _id });
      
      target.removeAttribute("disabled");
      removeCommentsCards(index + 1, true);
    } catch (err) {
      target.removeAttribute("disabled");
      console.log(err);
    }
  };

  const hideReplies = () => {
    (commentData as any).isReplyLoaded = false;
    removeCommentsCards(index + 1);
  };

  const handleReplyClick = () => {
    if (!user?.access_token) {
      return addNotification({
        message: "Please login to reply",
        type: "error"
      });
    }
    setReplying(prevVal => !prevVal);
  };

  const LoadMoreRepliesButton = () => {
    let parentIndex = getParentIndex();

    let btn = (
      <button
        onClick={() => loadReplies({ skip: index - (parentIndex || 0), currentIndex: parentIndex })}
        className="text-[#555] dark:text-gray-300 p-2 px-3 hover:bg-[#f3f3f3] dark:hover:bg-[#1e1e1e] rounded-md flex items-center gap-2"
      >
        Load More Replies
      </button>
    );

    if (commentsArr[index + 1]) {
      if ((commentsArr[index + 1]?.childrenLevel || 0) < (commentsArr[index]?.childrenLevel || 0)) {
        if (parentIndex !== undefined && (index - parentIndex) < (commentsArr[parentIndex]?.children.length || 0)) {
          return btn;
        }
      }
    } else {
      if (parentIndex !== undefined && (index - parentIndex) < (commentsArr[parentIndex]?.children.length || 0)) {
        return btn;
      }
    }
    
    return null;
  };

  return (
    <div className="w-full" style={{ paddingLeft: `${leftVal * 10}px` }}>
      <div className="my-5 p-6 rounded-md border border-gray-100">
        <div className="flex gap-3 items-center mb-8">
          <img src={profile_img} alt="" className="w-6 h-6 rounded-full" />

          <p className="line-clamp-1">{commented_by_fullname} @{commented_by_username}</p>
          <p className="min-w-fit">{getDay(commentedAt)}</p>
        </div>

        <p className="font-gelasio text-xl ml-3">{comment}</p>

        <div className="flex gap-5 items-center mt-5">
          {isReplyLoaded ? (
            <button
              onClick={hideReplies}
              className="text-[#555] dark:text-gray-300 p-2 px-3 hover:bg-[#f3f3f3] dark:hover:bg-[#1e1e1e] rounded-md flex items-center gap-2"
            >
              <i className="fi fi-rs-comment-dots"></i> Hide Reply
            </button>
          ) : (
            <button
              onClick={() => loadReplies({})}
              className="text-[#555] dark:text-gray-300 p-2 px-3 hover:bg-[#f3f3f3] dark:hover:bg-[#1e1e1e] rounded-md flex items-center gap-2"
            >
              <i className="fi fi-rs-comment-dots"></i> {children.length} Reply
            </button>
          )}

          <button className="underline" onClick={handleReplyClick}>Reply</button>

          {(user?.username === commented_by_username || user?.username === project?.author.personal_info.username) && (
            <button
              onClick={handleDeleteComment}
              className="p-2 px-3 rounded-md border border-gray-100 ml-auto hover:bg-red-50 hover:text-red-500 flex items-center"
            >
              <i className="fi fi-rr-trash"></i>
            </button>
          )}
        </div>

        {isReplying && (
          <div className="mt-8">
            <CommentField action="reply" index={index} replyingTo={_id} setReplying={setReplying} />
          </div>
        )}
      </div>

      <LoadMoreRepliesButton />
    </div>
  );
};

export default CommentCard;
