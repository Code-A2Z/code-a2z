import { Link } from 'react-router-dom';
import { useState } from 'react';
import { getDay } from '../../../shared/utils/date';
import NotificationCommentField from './notificationCommentField';
import { GetNotificationsResponse } from '../../../infra/rest/apis/notification/typing';
import { NotificationPaginationState } from '../states';
import { deleteComment } from '../../../infra/rest/apis/comment';
import { useNotifications as useNotificationHook } from '../../../shared/hooks/use-notification';
import { ROUTES_V1 } from '../../../app/routes/constants/routes';
import {
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Button,
  Box,
  Chip,
  IconButton,
  Collapse,
  Paper,
  Divider,
} from '@mui/material';
import {
  Favorite,
  Comment,
  Reply,
  Notifications,
  Delete,
  AccessTime,
} from '@mui/icons-material';

interface NotificationCardProps {
  data: GetNotificationsResponse;
  index: number;
  notificationState: {
    notifications: NotificationPaginationState;
    setNotifications: (state: NotificationPaginationState) => void;
  };
}

const NotificationCard = ({
  data,
  index,
  notificationState,
}: NotificationCardProps) => {
  const [isReplying, setIsReplying] = useState(false);

  const {
    seen,
    type,
    createdAt,
    comment_id,
    replied_on_comment_id,
    personal_info: { fullname, username, profile_img } = {},
    project_id: { _id: project_id = '', title = '' } = {},
    _id: notification_id,
  } = data;

  const { addNotification } = useNotificationHook();

  const { notifications, setNotifications } = notificationState;

  const handleReplyClick = () => {
    setIsReplying(preVal => !preVal);
  };

  const handleDelete = async (commentId: string) => {
    try {
      await deleteComment(commentId);
      const newResults = notifications.results.filter((_, i) => i !== index);
      setNotifications({
        ...notifications,
        results: newResults,
        totalDocs: notifications.totalDocs - 1,
        deleteDocCount: (notifications.deleteDocCount || 0) + 1,
      });
      addNotification({
        message: 'Comment deleted successfully',
        type: 'success',
      });
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } };
      addNotification({
        message: err.response?.data?.error || 'Failed to delete comment',
        type: 'error',
      });
    }
  };

  const getNotificationColor = () => {
    switch (type) {
      case 'like':
        return 'error';
      case 'comment':
        return 'primary';
      case 'reply':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <Paper
      elevation={!seen ? 3 : 1}
      sx={{
        mb: 2,
        borderLeft: !seen ? 4 : 2,
        borderLeftColor: `${getNotificationColor()}.main`,
        position: 'relative',
        '&:hover': {
          boxShadow: theme => theme.shadows[4],
          transform: 'scale(1.01)',
          transition: 'all 0.2s ease-in-out',
        },
      }}
    >
      {/* Unread indicator */}
      {!seen && (
        <Box
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            width: 12,
            height: 12,
            bgcolor: 'primary.main',
            borderRadius: '50%',
            animation: 'pulse 2s infinite',
          }}
        />
      )}

      <ListItem alignItems="flex-start" sx={{ p: 3 }}>
        <ListItemAvatar>
          <Box sx={{ position: 'relative' }}>
            <Avatar
              src={profile_img}
              alt={`${fullname}'s profile`}
              sx={{
                width: 56,
                height: 56,
                border: 2,
                borderColor: 'background.paper',
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                bottom: -4,
                right: -4,
                width: 24,
                height: 24,
                bgcolor: 'background.paper',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: 1,
                borderColor: 'divider',
              }}
            >
              {type === 'like' ? (
                <Favorite color="error" />
              ) : type === 'comment' ? (
                <Comment color="primary" />
              ) : type === 'reply' ? (
                <Reply color="success" />
              ) : (
                <Notifications color="action" />
              )}
            </Box>
          </Box>
        </ListItemAvatar>

        <ListItemText
          primary={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Typography
                variant="h6"
                component="span"
                sx={{ fontWeight: 600 }}
              >
                <Box
                  component="span"
                  sx={{ display: { xs: 'none', lg: 'inline' } }}
                >
                  {fullname}
                </Box>
                <Link
                  to={`/user/${username}`}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <Typography
                    component="span"
                    sx={{
                      color: 'primary.main',
                      fontWeight: 500,
                      '&:hover': { color: 'primary.dark' },
                    }}
                  >
                    @{username}
                  </Typography>
                </Link>
              </Typography>
            </Box>
          }
          secondary={
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                <Typography component="span" sx={{ fontWeight: 500 }}>
                  {type === 'like'
                    ? 'liked your project'
                    : type === 'comment'
                      ? 'commented on'
                      : 'replied to your comment'}
                </Typography>
              </Typography>

              {type === 'reply' ? (
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    bgcolor: 'grey.100',
                    borderColor: 'grey.300',
                  }}
                >
                  <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                    "{replied_on_comment_id?.comment || 'No comment'}"
                  </Typography>
                </Paper>
              ) : (
                <Link
                  to={`${ROUTES_V1.HOME}/${project_id}`}
                  style={{ textDecoration: 'none' }}
                >
                  <Chip
                    label={`"${title}"`}
                    color="primary"
                    variant="outlined"
                    size="small"
                    sx={{
                      '&:hover': {
                        bgcolor: 'primary.light',
                        color: 'primary.contrastText',
                      },
                    }}
                  />
                </Link>
              )}
            </Box>
          }
        />
      </ListItem>

      {type !== 'like' && comment_id?.comment && (
        <Box sx={{ ml: 9, mr: 3, mb: 2 }}>
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              bgcolor: 'grey.50',
              borderColor: 'grey.300',
            }}
          >
            <Typography variant="body1" sx={{ fontFamily: 'Gelasio, serif' }}>
              "{comment_id.comment}"
            </Typography>
          </Paper>
        </Box>
      )}

      <Divider />

      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AccessTime sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="caption" color="text.secondary">
              {getDay(createdAt)}
            </Typography>
          </Box>

          {type !== 'like' && comment_id && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Button
                size="small"
                startIcon={<Reply />}
                onClick={handleReplyClick}
                sx={{ textTransform: 'none' }}
              >
                Reply
              </Button>

              <IconButton
                size="small"
                onClick={() => handleDelete(comment_id._id)}
                color="error"
              >
                <Delete />
              </IconButton>
            </Box>
          )}
        </Box>
      </Box>

      <Collapse in={isReplying} timeout="auto" unmountOnExit>
        <Box sx={{ p: 2, bgcolor: 'grey.50' }}>
          <NotificationCommentField
            project_id={project_id}
            replyingTo={comment_id?._id}
            setReplying={setIsReplying}
            notification_id={notification_id}
          />
        </Box>
      </Collapse>
    </Paper>
  );
};

export default NotificationCard;
