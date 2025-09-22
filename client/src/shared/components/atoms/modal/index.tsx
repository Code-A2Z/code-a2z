/** @jsxImportSource @emotion/react */
import { Modal, ModalProps } from '@mui/material';
import { css } from '@emotion/react';

const CAModal = (props: ModalProps) => {
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

export default CAModal;
