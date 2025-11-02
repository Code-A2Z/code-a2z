/** @jsxImportSource @emotion/react */
import { Modal, ModalProps } from '@mui/material';
import { css } from '@emotion/react';

const A2ZModal = (props: ModalProps) => {
  return (
    <Modal
      css={css`
        outline: none;
        &:focus-visible {
          outline: none;
        }
      `}
      {...props}
    />
  );
};

export default A2ZModal;
