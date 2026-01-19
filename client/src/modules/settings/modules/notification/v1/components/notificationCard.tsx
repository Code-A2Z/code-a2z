import { Link } from 'react-router-dom';
import { useState } from 'react';
import { getDay } from '../../../../../../shared/utils/date';
import NotificationCommentField from './notificationCommentField';
import { GetNotificationsResponse } from '../../../../../../infra/rest/apis/notification/typing';
import { NotificationPaginationState } from '../states';
import { deleteComment } from '../../../../../../infra/rest/apis/comment';
import { useNotifications as useNotificationHook } from '../../../../../../shared/hooks/use-notification';
import { ROUTES_V1 } from '../../../../../../app/routes/constants/routes';
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
        borderRadius: 2,
        borderLeftWidth: !seen ? 4 : 2,
        borderLeftStyle: 'solid',
        borderLeftColor: `${getNotificationColor()}.main`,
        border: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
        position: 'relative',
        transition: 'box-shadow 0.2s ease, transform 0.2s ease',
        '&:hover': {
          boxShadow: theme => theme.shadows[3],
          transform: 'translateY(-2px)',
        },
      }}
    >
      {/* Unread indicator */}
      {!seen && (
        <Box
          sx={{
            position: 'absolute',
            top: 14,
            right: 14,
            width: 10,
            height: 10,
            bgcolor: 'primary.main',
            borderRadius: '50%',
            boxShadow: theme => `0 0 0 4px ${theme.palette.primary.main}20`,
          }}
        />
      )}

      <ListItem alignItems="flex-start" sx={{ p: { xs: 2, sm: 3 } }}>
        <ListItemAvatar>
          <Box sx={{ position: 'relative' }}>
            <Avatar
              src={profile_img}
              alt={`${fullname}'s profile`}
              sx={{
                width: { xs: 44, sm: 56 },
                height: { xs: 44, sm: 56 },
                border: 2,
                borderColor: 'background.paper',
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                bottom: -4,
                right: -4,
                width: { xs: 20, sm: 24 },
                height: { xs: 20, sm: 24 },
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
                <Favorite color="error" fontSize="small" />
              ) : type === 'comment' ? (
                <Comment color="primary" fontSize="small" />
              ) : type === 'reply' ? (
                <Reply color="success" fontSize="small" />
              ) : (
                <Notifications color="action" fontSize="small" />
              )}
            </Box>
          </Box>
        </ListItemAvatar>

        <ListItemText
          primary={
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                mb: 1,
                flexWrap: 'wrap',
              }}
            >
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
                    bgcolor: 'background.default',
                    borderColor: 'divider',
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
        <Box sx={{ ml: { xs: 2, sm: 9 }, mr: { xs: 2, sm: 3 }, mb: 2 }}>
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              bgcolor: 'background.default',
              borderColor: 'divider',
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
          p: { xs: 1.5, sm: 2 },
          display: 'flex',
          alignItems: { xs: 'flex-start', sm: 'center' },
          justifyContent: 'space-between',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 1.5, sm: 0 },
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
        <Box sx={{ p: { xs: 2, sm: 2.5 }, bgcolor: 'background.default' }}>
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
