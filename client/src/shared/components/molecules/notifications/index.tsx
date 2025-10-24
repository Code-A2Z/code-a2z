/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useAtomValue } from 'jotai';
import { notificationsAtom } from '../../../states/notification';
import { NotificationType } from '../../../../infra/rest/typings/notification';
import { Alert, Slide, IconButton, Collapse } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useState } from 'react';

function CANotifications() {
  const notifications = useAtomValue(notificationsAtom);
  const [dismissedNotifications, setDismissedNotifications] = useState<
    Set<string>
  >(new Set());

  const handleDismiss = (id: string) => {
    setDismissedNotifications(prev => new Set([...prev, id]));
  };

  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        position: fixed;
        top: 24px;
        right: 24px;
        z-index: 10000;
        pointer-events: none;
        max-width: 400px;
        width: 100%;
      `}
    >
      {notifications.map(
        ({ id, message, type = NotificationType.INFO, open }) => {
          const isDismissed = dismissedNotifications.has(id);

          return (
            <Collapse
              key={id}
              in={open && !isDismissed}
              timeout={300}
              style={{ marginBottom: '12px', pointerEvents: 'auto' }}
            >
              <Slide
                direction="left"
                in={open && !isDismissed}
                mountOnEnter
                unmountOnExit
                timeout={300}
              >
                <Alert
                  severity={type}
                  sx={{
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                    border: '1px solid rgba(0, 0, 0, 0.05)',
                    backdropFilter: 'blur(10px)',
                    '& .MuiAlert-message': {
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '14px',
                      fontWeight: 500,
                    },
                    '& .MuiAlert-icon': {
                      fontSize: '20px',
                    },
                  }}
                  action={
                    <IconButton
                      size="small"
                      onClick={() => handleDismiss(id)}
                      sx={{
                        color: 'inherit',
                        '&:hover': {
                          backgroundColor: 'rgba(0, 0, 0, 0.04)',
                        },
                      }}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  }
                >
                  {message}
                </Alert>
              </Slide>
            </Collapse>
          );
        }
      )}
    </div>
  );
}

export default CANotifications;
