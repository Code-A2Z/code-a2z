import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useState } from 'react';
import { UserAtom } from '../../../shared/states/user';
import { useNotifications } from '../../../shared/hooks/use-notification';
import { commentNotification } from '../requests';
import { ProjectAtom } from '../../../shared/states/project';
import { TotalParentCommentsLoadedAtom } from '../states';
import { Comment } from '../../../infra/rest/typings';

const CommentField = ({
  action,
  index = undefined,
  replyingTo = undefined,
  setReplying,
}: {
  action: string;
  index?: number;
  replyingTo?: string;
  setReplying: (value: boolean) => void;
}) => {
  const user = useAtomValue(UserAtom);
  const [project, setProject] = useAtom(ProjectAtom);
  const setTotalParentCommentsLoaded = useSetAtom(
    TotalParentCommentsLoadedAtom
  );
  const { addNotification } = useNotifications();

  const [comment, setComment] = useState('');

  const handleComment = async () => {
    if (!user?.access_token) {
      return addNotification({
        message: 'Please login to comment',
        type: 'error',
      });
    }
    if (!comment.length) {
      return addNotification({
        message: 'Write something to leave a comment...',
        type: 'error',
      });
    }
    if (!project || !project._id) {
      return addNotification({
        message: 'Project not found',
        type: 'error',
      });
    }

    try {
      const response = await commentNotification({
        _id: project._id,
        comment,
        project_author: project.author._id || '',
        replying_to: replyingTo,
      });

      if (response._id) {
        setComment('');

        // Add user info to the response
        const commentWithUser = {
          ...response,
          commented_by: {
            personal_info: {
              username: user.username || '',
              fullname: user.fullname || '',
              profile_img: user.profile_img || '',
            },
          },
        };

        const currentComments = project.comments?.results || [];
        let newCommentArr: Comment[];

        if (replyingTo && index !== undefined) {
          // Handle reply
          const parentComment = currentComments[index];
          if (parentComment) {
            parentComment.children.push(response._id);
            commentWithUser.childrenLevel =
              (parentComment.childrenLevel || 0) + 1;
            commentWithUser.parentIndex = index;
            (parentComment as Comment).isReplyLoaded = true;

            newCommentArr = [...currentComments];
            newCommentArr.splice(index + 1, 0, commentWithUser);
          } else {
            newCommentArr = currentComments;
          }
          setReplying(false);
        } else {
          // Handle new comment
          commentWithUser.childrenLevel = 0;
          newCommentArr = [commentWithUser, ...currentComments];
        }

        setProject({
          ...project,
          comments: {
            ...project.comments,
            results: newCommentArr,
          },
          activity: {
            ...project.activity,
            total_comments: (project.activity.total_comments || 0) + 1,
            total_parent_comments:
              (project.activity.total_parent_comments || 0) +
              (replyingTo ? 0 : 1),
          },
        });

        setTotalParentCommentsLoaded(prevVal => prevVal + (replyingTo ? 0 : 1));
      }
    } catch (error) {
      addNotification({
        message: 'Failed to post comment',
        type: 'error',
      });
      console.error('Comment error:', error);
    }
  };

  return (
    <>
      <textarea
        value={comment}
        onChange={e => setComment(e.target.value)}
        placeholder="Leave a comment..."
        className="input-box pl-5 placeholder:text-gray-500 resize-none h-[150px] overflow-auto"
      />
      <button
        className="btn-dark dark:btn-light mt-5 px-10"
        onClick={handleComment}
      >
        {action}
      </button>
    </>
  );
};

export default CommentField;
