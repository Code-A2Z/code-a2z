/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useAtomValue } from 'jotai';
import { notificationsAtom } from '../../../states/notification';
import { NotificationType } from '../../../typings/notification';
import { Alert, Slide } from '@mui/material';

function CANotifications() {
  const notifications = useAtomValue(notificationsAtom);

  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        position: fixed;
        bottom: 12px;
        right: 24px;
        z-index: 10000;
        pointer-events: none;
      `}
    >
      {notifications.map(
        ({ id, message, type = NotificationType.INFO, open }) => (
          <Slide
            key={id}
            direction="left"
            in={open}
            mountOnEnter
            unmountOnExit
            style={{ marginBottom: '12px', pointerEvents: 'auto' }}
            onExited={() => {}}
          >
            <Alert severity={type}>{message}</Alert>
          </Slide>
        )
      )}
    </div>
  );
}

export default CANotifications;
