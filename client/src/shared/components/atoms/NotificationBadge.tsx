import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAtom } from 'jotai';
import { UserAtom } from '../../states/user';
import {
  IconButton,
  Badge,
  Tooltip,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
} from '@mui/icons-material';

interface NotificationBadgeProps {
  className?: string;
}

const NotificationBadge: React.FC<NotificationBadgeProps> = ({ className = '' }) => {
  const [user] = useAtom(UserAtom);

  const notificationIcon = (
    <motion.div
      animate={user.new_notification_available ? { scale: [1, 1.1, 1] } : {}}
      transition={{ duration: 1, repeat: Infinity }}
    >
      <NotificationsIcon />
    </motion.div>
  );

  return (
    <Tooltip title="Notifications">
      <Link to="/notifications" style={{ textDecoration: 'none', color: 'inherit' }}>
        <IconButton
          color="inherit"
          sx={{
            position: 'relative',
            '&:hover': {
              backgroundColor: 'action.hover',
            },
          }}
          className={className}
        >
          {user.new_notification_available ? (
            <Badge
              variant="dot"
              color="error"
              sx={{
                '& .MuiBadge-badge': {
                  animation: 'pulse 1.5s infinite',
                },
              }}
            >
              {notificationIcon}
            </Badge>
          ) : (
            notificationIcon
          )}
        </IconButton>
      </Link>
    </Tooltip>
  );
};

export default NotificationBadge;
