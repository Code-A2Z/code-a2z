import { useState } from 'react';
import axios from 'axios';
import { useAtom } from 'jotai';
import { UserAtom } from '../../../shared/states/user';
import { NotificationState } from '../../../shared/typings';

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
    <>
      <textarea
        value={comment}
        onChange={e => setComment(e.target.value)}
        placeholder="Leave a reply..."
        className="input-box pl-5 placeholder:text-gray-500 resize-none h-[150px] overflow-auto"
      ></textarea>
      <button className="btn-dark mt-5 px-10" onClick={handleComment}>
        Reply
      </button>
    </>
  );
};

export default NotificationCommentField;
