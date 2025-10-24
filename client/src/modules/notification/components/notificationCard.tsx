import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useAtom } from 'jotai';
import { motion } from 'framer-motion';
import { getDay } from '../../../shared/utils/date';
import NotificationCommentField from './notificationCommentField';
import { UserAtom } from '../../../shared/states/user';
import {
  NotificationData,
  NotificationState,
} from '../../../infra/rest/typings';
import axios from 'axios';
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
  data: NotificationData;
  index: number;
  notificationState: {
    notifications: NotificationState;
    setNotifications: (state: NotificationState) => void;
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
    reply,
    createdAt,
    comment,
    replied_on_comment,
    user,
    user: { personal_info: { fullname, username, profile_img } = {} } = {},
    project: { _id = '', project_id = '', title = '' } = {},
    _id: notification_id,
  } = data;

  const [userAuth] = useAtom(UserAtom);

  const {
    username: author_username,
    profile_img: author_profile_img,
    access_token,
  } = userAuth;

  const {
    notifications,
    notifications: { results, totalDocs },
    setNotifications,
  } = notificationState;

  const handleReplyClick = () => {
    setIsReplying(preVal => !preVal);
  };

  const handleDelete = (
    comment_id: string,
    type: string,
    target: EventTarget | null
  ) => {
    if (!(target instanceof HTMLElement)) return;

    target.setAttribute('disabled', 'true');

    axios
      .post(
        import.meta.env.VITE_SERVER_DOMAIN + '/api/notification/delete-comment',
        { _id: comment_id },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      )
      .then(() => {
        if (type === 'comment') {
          results.splice(index, 1);
        } else {
          delete results[index].reply;
        }

        target.removeAttribute('disabled');
        setNotifications({
          ...notifications,
          results,
          totalDocs: totalDocs - 1,
          deleteDocCount: (notifications.deleteDocCount || 0) + 1,
        });
      })
      .catch((err: unknown) => {
        console.log(err);
      });
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Paper
        elevation={!seen ? 3 : 1}
        sx={{
          mb: 2,
          borderLeft: !seen ? 4 : 2,
          borderLeftColor: `${getNotificationColor()}.main`,
          position: 'relative',
          '&:hover': {
            elevation: 4,
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
              <Box
                sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}
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
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
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
                      "{replied_on_comment?.comment || 'No comment'}"
                    </Typography>
                  </Paper>
                ) : (
                  <Link
                    to={`/project/${project_id}`}
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

        {type !== 'like' && comment?.comment && (
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
                "{comment.comment}"
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

            {type !== 'like' && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {!reply && (
                  <Button
                    size="small"
                    startIcon={<Reply />}
                    onClick={handleReplyClick}
                    sx={{ textTransform: 'none' }}
                  >
                    Reply
                  </Button>
                )}

                <IconButton
                  size="small"
                  onClick={e =>
                    handleDelete(comment?._id || '', 'comment', e.target)
                  }
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
              _id={_id}
              project_author={{ _id: user?.personal_info?.username || '' }}
              index={index}
              replyingTo={comment?._id}
              setReplying={setIsReplying}
              notification_id={notification_id}
              notificationData={notificationState}
            />
          </Box>
        </Collapse>

        {reply && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Box sx={{ ml: 9, mr: 3, p: 2, bgcolor: 'grey.50' }}>
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <Avatar
                  src={author_profile_img}
                  sx={{ width: 32, height: 32 }}
                  alt={`${author_username}'s profile`}
                />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2">
                    <Link
                      to={`/user/${author_username}`}
                      style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                      <Typography
                        component="span"
                        sx={{
                          color: 'primary.main',
                          fontWeight: 600,
                          '&:hover': { color: 'primary.dark' },
                        }}
                      >
                        @{author_username}
                      </Typography>
                    </Link>
                    <Typography
                      component="span"
                      color="text.secondary"
                      sx={{ mx: 1 }}
                    >
                      replied to
                    </Typography>
                    <Link
                      to={`/user/${username}`}
                      style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                      <Typography
                        component="span"
                        sx={{
                          color: 'primary.main',
                          fontWeight: 600,
                          '&:hover': { color: 'primary.dark' },
                        }}
                      >
                        @{username}
                      </Typography>
                    </Link>
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ ml: 5 }}>
                <Typography
                  variant="body1"
                  sx={{ fontFamily: 'Gelasio, serif', mb: 2 }}
                >
                  "{reply.comment}"
                </Typography>

                <IconButton
                  size="small"
                  onClick={e => handleDelete(reply._id, 'reply', e.target)}
                  color="error"
                >
                  <Delete />
                </IconButton>
              </Box>
            </Box>
          </motion.div>
        )}
      </Paper>
    </motion.div>
  );
};

export default NotificationCard;
