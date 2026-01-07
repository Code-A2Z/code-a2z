import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useState } from 'react';
import { Box, Button, TextField } from '@mui/material';
import {
  AllCommentsAtom,
  Comments,
  TotalParentCommentsLoadedAtom,
} from '../states';
import { useNotifications } from '../../../../hooks/use-notification';
import { UserAtom } from '../../../../../infra/states/user';
import { useAuth } from '../../../../hooks/use-auth';
import { SelectedProjectAtom } from '../../../../../modules/home/modules/project/v1/states';
import { addComment } from '../../../../../infra/rest/apis/comment';

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
  const [selectedProject, setSelectedProject] = useAtom(SelectedProjectAtom);
  const setTotalParentCommentsLoaded = useSetAtom(
    TotalParentCommentsLoadedAtom
  );
  const [comments, setComments] = useAtom(AllCommentsAtom);
  const { addNotification } = useNotifications();
  const { isAuthenticated } = useAuth();

  const [comment, setComment] = useState('');

  const handleComment = async () => {
    if (!user || !isAuthenticated()) {
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
    if (!selectedProject || !selectedProject._id) {
      return addNotification({
        message: 'Project not found',
        type: 'error',
      });
    }

    try {
      const response = await addComment({
        project_id: selectedProject._id,
        comment,
        notification_id: selectedProject.user_id._id,
        replying_to: replyingTo,
      });

      if (response.data && response.data._id) {
        setComment('');

        // Add user info and required fields to the response
        const commentWithUser: Comments = {
          ...response.data,
          project_id: selectedProject._id,
          personal_info: user.personal_info,
          is_reply: !!replyingTo,
          parent_comment_id: replyingTo || null,
          updatedAt: response.data.createdAt,
          children_level: 0,
        };

        const currentComments = comments || [];
        let newCommentArr: Comments[];

        if (replyingTo && index !== undefined) {
          // Handle reply
          const parentComment = currentComments[index];
          if (parentComment) {
            parentComment.children_comment_ids.push(response.data._id);
            commentWithUser.children_level =
              (parentComment.children_level || 0) + 1;
            (parentComment as Comments).is_reply_loaded = true;

            newCommentArr = [...currentComments];
            newCommentArr.splice(index + 1, 0, commentWithUser);
          } else {
            newCommentArr = currentComments;
          }
          setReplying(false);
        } else {
          // Handle new comment
          newCommentArr = [commentWithUser, ...currentComments];
        }

        setComments(newCommentArr);
        setSelectedProject({
          ...selectedProject,
          activity: {
            ...selectedProject.activity,
            total_comments: (selectedProject.activity.total_comments || 0) + 1,
            total_parent_comments:
              (selectedProject.activity.total_parent_comments || 0) +
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
    <Box display="flex" flexDirection="column" gap={2} mt={2}>
      <TextField
        multiline
        minRows={4}
        variant="outlined"
        placeholder="Leave a comment..."
        value={comment}
        onChange={e => setComment(e.target.value)}
        fullWidth
      />
      <Button
        variant="contained"
        color="primary"
        sx={{
          alignSelf: 'flex-end',
          px: 4,
          textTransform: 'none',
          borderRadius: 2,
          fontWeight: 500,
        }}
        onClick={handleComment}
      >
        {action}
      </Button>
    </Box>
  );
};

export default CommentField;
