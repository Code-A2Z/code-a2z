import { useState } from 'react';
import axios from 'axios';
import { useAtom } from 'jotai';
import { UserAtom } from '../../../shared/states/user';
import { NotificationState } from '../../../shared/typings';
import {
  TextField,
  Button,
  Box,
  Typography,
} from '@mui/material';
import {
  Reply,
} from '@mui/icons-material';

interface NotificationCommentFieldProps {
  _id: string;
  project_author: {
    _id: string;
  };
  index?: number;
  replyingTo?: string;
  setReplying: (value: boolean) => void;
  notification_id: string;
  notificationData: {
    notifications: NotificationState;
    setNotifications: (state: NotificationState) => void;
  };
}

const NotificationCommentField = ({
  _id,
  project_author,
  index,
  replyingTo,
  setReplying,
  notification_id,
  notificationData,
}: NotificationCommentFieldProps) => {
  const [comment, setComment] = useState('');
  const [user] = useAtom(UserAtom);

  const { _id: user_id } = project_author;
  const {
    notifications,
    notifications: { results },
    setNotifications,
  } = notificationData;

  const handleComment = () => {
    if (!comment.length) {
      console.error('Write something to leave a comment...');
      return;
    }

    if (!user.access_token) {
      console.error('User not authenticated');
      return;
    }

    axios
      .post(
        import.meta.env.VITE_SERVER_DOMAIN + '/api/notification/comment',
        {
          _id,
          comment,
          project_author: user_id,
          replying_to: replyingTo,
          notification_id,
        },
        {
          headers: {
            Authorization: `Bearer ${user.access_token}`,
          },
        }
      )
      .then(({ data }: { data: { _id: string } }) => {
        setReplying(false);

        if (typeof index === 'number' && results[index]) {
          results[index].reply = { comment, _id: data._id };
          setNotifications({ ...notifications, results });
        }
      })
      .catch((err: unknown) => {
        console.log(err);
      });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box sx={{ position: 'relative' }}>
        <TextField
          multiline
          rows={4}
          value={comment}
          onChange={e => setComment(e.target.value)}
          placeholder="Write your reply..."
          variant="outlined"
          fullWidth
          inputProps={{ maxLength: 500 }}
          sx={{
            '& .MuiOutlinedInput-root': {
              resize: 'none',
              '& fieldset': {
                borderColor: 'grey.300',
              },
              '&:hover fieldset': {
                borderColor: 'grey.400',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'primary.main',
              },
            },
          }}
        />
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            position: 'absolute',
            bottom: 8,
            right: 12,
            fontSize: '0.75rem',
          }}
        >
          {comment.length}/500
        </Typography>
      </Box>
      
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Button
          onClick={() => setReplying(false)}
          color="inherit"
          sx={{ textTransform: 'none' }}
        >
          Cancel
        </Button>
        
        <Button
          onClick={handleComment}
          disabled={!comment.trim() || comment.length > 500}
          variant="contained"
          startIcon={<Reply />}
          sx={{ textTransform: 'none' }}
        >
          Reply
        </Button>
      </Box>
    </Box>
  );
};

export default NotificationCommentField;
