/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useAtom } from "jotai";
import { notificationsAtom } from "../../../states/notification";
import { NotificationType } from "../../../typings/notification";
import { Alert, Slide } from "@mui/material";

function Notifications() {
  const [notifications] = useAtom(notificationsAtom);

  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        position: absolute;
        bottom: 12px;
        right: 24px;
        z-index: 10000;
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
            style={{ marginBottom: "12px" }}
            onExited={() => {}}
          >
            <Alert severity={type}>{message}</Alert>
          </Slide>
        )
      )}
    </div>
  );
}

export default Notifications;
