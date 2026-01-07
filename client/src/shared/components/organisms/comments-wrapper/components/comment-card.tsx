import { useState } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import {
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  Typography,
  useTheme,
} from '@mui/material';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import {
  AllCommentsAtom,
  Comments,
  TotalParentCommentsLoadedAtom,
} from '../states';
import { UserAtom } from '../../../../../infra/states/user';
import { SelectedProjectAtom } from '../../../../../modules/home/modules/project/v1/states';
import { useNotifications } from '../../../../hooks/use-notification';
import {
  deleteComment,
  getReplies,
} from '../../../../../infra/rest/apis/comment';
import CommentField from './comment-field';
import { GetRepliesResponse } from '../../../../../infra/rest/apis/comment/typing';
import { useAuth } from '../../../../hooks/use-auth';
import { getDay } from '../../../../utils/date';

const CommentCard = ({
  index,
  leftVal,
  comment,
}: {
  index: number;
  leftVal: number;
  comment: Comments;
}) => {
  const user = useAtomValue(UserAtom);
  const [selectedProject, setSelectedProject] = useAtom(SelectedProjectAtom);
  const setTotalParentCommentsLoaded = useSetAtom(
    TotalParentCommentsLoadedAtom
  );
  const [comments, setComments] = useAtom(AllCommentsAtom);
  const { addNotification } = useNotifications();
  const { isAuthenticated } = useAuth();
  const theme = useTheme();

  const [isReplying, setReplying] = useState(false);

  if (!selectedProject || !comments) return null;

  const getParentIndex = (): number | undefined => {
    let startingPoint = index - 1;

    try {
      while (
        startingPoint >= 0 &&
        comment.children_level !== undefined &&
        comments[startingPoint] &&
        (comments[startingPoint]?.children_level ?? 0) >= comment.children_level
      ) {
        startingPoint--;
      }
    } catch {
      return undefined;
    }

    return startingPoint >= 0 ? startingPoint : undefined;
  };

  const removeCommentsCards = (startingPoint: number, isDelete = false) => {
    const newCommentsArr = [...comments];

    if (newCommentsArr[startingPoint]) {
      while (
        comment.children_level !== undefined &&
        newCommentsArr[startingPoint] &&
        (newCommentsArr[startingPoint]?.children_level ?? 0) >
          comment.children_level
      ) {
        newCommentsArr.splice(startingPoint, 1);
        if (!newCommentsArr[startingPoint]) {
          break;
        }
      }
    }

    if (isDelete) {
      const parentIndex = getParentIndex();

      if (parentIndex !== undefined && newCommentsArr[parentIndex]) {
        const parentComment = newCommentsArr[parentIndex];
        if (parentComment) {
          parentComment.children_comment_ids =
            parentComment.children_comment_ids.filter(
              child => child !== comment._id
            );

          if (!parentComment.children_comment_ids.length) {
            (parentComment as Comments).is_reply_loaded = false;
          }
        }
      }

      newCommentsArr.splice(index, 1);
    }

    if (comment.children_level === 0 && isDelete) {
      setTotalParentCommentsLoaded(prevVal => prevVal - 1);
    }

    setComments(newCommentsArr);
    setSelectedProject({
      ...selectedProject,
      activity: {
        ...selectedProject.activity,
        total_parent_comments:
          selectedProject.activity.total_parent_comments -
          (comment.children_level === 0 && isDelete ? 1 : 0),
      },
    });
  };

  const loadReplies = async ({
    skip = 0,
    currentIndex = index,
  }: {
    skip?: number;
    currentIndex?: number;
  }) => {
    if (!comments[currentIndex]?.children_comment_ids.length) return;
    hideReplies();

    try {
      const response = await getReplies({
        comment_id: comments[currentIndex]._id,
        skip,
      });

      if (!response.data?.length) return;
      const transformed = response.data.map(comment => ({
        ...comment,
        children_level: 0,
      })) as (GetRepliesResponse & { children_level: number })[];

      const newCommentsArr = [...comments];
      (newCommentsArr[currentIndex] as Comments).is_reply_loaded = true;

      for (let i = 0; i < response.data?.length; i++) {
        transformed[i].children_level =
          (comments[currentIndex]?.children_level || 0) + 1;
        newCommentsArr.splice(currentIndex + 1 + i + skip, 0, {
          project_id: comments[currentIndex].project_id,
          updatedAt: comments[currentIndex].updatedAt,
          ...transformed[i],
        });
      }
      setComments(newCommentsArr);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteComment = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    const target = e.target as HTMLButtonElement;
    target.setAttribute('disabled', 'true');

    try {
      await deleteComment(comment._id);

      target.removeAttribute('disabled');
      removeCommentsCards(index + 1, true);
    } catch (err) {
      target.removeAttribute('disabled');
      console.log(err);
    }
  };

  const hideReplies = () => {
    (comment as Comments).is_reply_loaded = false;
    removeCommentsCards(index + 1);
  };

  const handleReplyClick = () => {
    if (!isAuthenticated()) {
      return addNotification({
        message: 'Please login to reply',
        type: 'error',
      });
    }
    setReplying(prevVal => !prevVal);
  };

  const LoadMoreRepliesButton = () => {
    const parentIndex = getParentIndex();

    const btn = (
      <button
        onClick={() =>
          loadReplies({
            skip: index - (parentIndex || 0),
            currentIndex: parentIndex,
          })
        }
        className="text-[#555] dark:text-gray-300 p-2 px-3 hover:bg-[#f3f3f3] dark:hover:bg-[#1e1e1e] rounded-md flex items-center gap-2"
      >
        Load More Replies
      </button>
    );

    if (comments[index + 1]) {
      if (
        (comments[index + 1]?.children_level || 0) <
        (comments[index]?.children_level || 0)
      ) {
        if (
          parentIndex !== undefined &&
          index - parentIndex <
            (comments[parentIndex]?.children_comment_ids.length || 0)
        ) {
          return btn;
        }
      }
    } else {
      if (
        parentIndex !== undefined &&
        index - parentIndex <
          (comments[parentIndex]?.children_comment_ids.length || 0)
      ) {
        return btn;
      }
    }

    return null;
  };

  return (
    <Box
      sx={{
        width: '100%',
        pl: `${leftVal * 10}px`,
      }}
    >
      <Box
        sx={{
          my: 3,
          p: 3,
          borderRadius: 2,
          border: `1px solid ${
            theme.palette.mode === 'dark'
              ? theme.palette.divider
              : theme.palette.grey[200]
          }`,
          bgcolor: theme.palette.background.paper,
        }}
      >
        {/* User info */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            mb: 3,
            flexWrap: 'wrap',
          }}
        >
          <Avatar
            src={comment.personal_info.profile_img}
            alt={comment.personal_info.fullname}
            sx={{ width: 28, height: 28 }}
          />
          <Typography
            variant="body2"
            noWrap
            sx={{ fontWeight: 500, flexShrink: 1 }}
          >
            {comment.personal_info.fullname} @{comment.personal_info.username}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ ml: 'auto', minWidth: 'fit-content' }}
          >
            {getDay(comment.updatedAt)}
          </Typography>
        </Box>

        {/* Comment text */}
        <Typography
          variant="body1"
          sx={{
            fontFamily: 'Gelasio, serif',
            fontSize: '1.2rem',
            ml: 1,
            mb: 2,
            wordBreak: 'break-word',
          }}
        >
          {comment.comment}
        </Typography>

        {/* Actions */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            mt: 2,
          }}
        >
          {comment.is_reply_loaded ? (
            <Button
              onClick={hideReplies}
              startIcon={<ChatBubbleOutlineIcon fontSize="small" />}
              sx={{
                color: theme.palette.text.secondary,
                textTransform: 'none',
                borderRadius: 1,
                px: 1.5,
                '&:hover': {
                  bgcolor:
                    theme.palette.mode === 'dark'
                      ? 'rgba(255,255,255,0.05)'
                      : theme.palette.grey[100],
                },
              }}
            >
              Hide Reply
            </Button>
          ) : (
            <Button
              onClick={() => loadReplies({})}
              startIcon={<ChatBubbleOutlineIcon fontSize="small" />}
              sx={{
                color: theme.palette.text.secondary,
                textTransform: 'none',
                borderRadius: 1,
                px: 1.5,
                '&:hover': {
                  bgcolor:
                    theme.palette.mode === 'dark'
                      ? 'rgba(255,255,255,0.05)'
                      : theme.palette.grey[100],
                },
              }}
            >
              {comment.children_comment_ids.length} Reply
            </Button>
          )}

          <Button
            onClick={handleReplyClick}
            variant="text"
            sx={{
              textDecoration: 'underline',
              textTransform: 'none',
              fontSize: '0.95rem',
              color: theme.palette.text.primary,
            }}
          >
            Reply
          </Button>

          {(user?.personal_info.username === comment.personal_info.username ||
            user?.personal_info.username ===
              selectedProject?.user_id.personal_info.username) && (
            <IconButton
              onClick={handleDeleteComment}
              sx={{
                ml: 'auto',
                border: `1px solid ${
                  theme.palette.mode === 'dark'
                    ? theme.palette.divider
                    : theme.palette.grey[200]
                }`,
                '&:hover': {
                  bgcolor: theme.palette.error.light,
                  color: theme.palette.error.main,
                },
              }}
            >
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          )}
        </Box>

        {/* Reply field */}
        {isReplying && (
          <Box sx={{ mt: 3 }}>
            <CommentField
              action="reply"
              index={index}
              replyingTo={comment._id}
              setReplying={setReplying}
            />
          </Box>
        )}
      </Box>

      {/* Load more replies button (if any) */}
      <LoadMoreRepliesButton />
      <Divider sx={{ my: 2 }} />
    </Box>
  );
};

export default CommentCard;
