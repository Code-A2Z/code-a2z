/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { Box } from '@mui/material';
import { Dispatch, SetStateAction, useState } from 'react';
import InputBox from '../../../atoms/input-box';
import CAModal from '../../../atoms/modal';
import { useNotifications } from '../../../../hooks/use-notification';
import { emailRegex } from '../../../../utils/regex';
import { subscribeUser } from '../requests';

const SubscribeModal = ({
  showSubscribeModal,
  setShowSubscribeModal,
}: {
  showSubscribeModal: boolean;
  setShowSubscribeModal: Dispatch<SetStateAction<boolean>>;
}) => {
  const { addNotification } = useNotifications();
  const [email, setEmail] = useState('');

  const handleSubscribe = async () => {
    if (!email.trim().length) {
      addNotification({
        message: 'Email is required',
        type: 'error',
      });
      return;
    }

    if (!emailRegex.test(email)) {
      addNotification({
        message: 'Please enter a valid email',
        type: 'error',
      });
      return;
    }

    const response = await subscribeUser(email);
    addNotification({
      message: response.message,
      type: response.status === 200 ? 'success' : 'error',
    });
    setShowSubscribeModal(false);
    setEmail('');
  };

  return (
    <CAModal
      open={showSubscribeModal}
      onClose={() => {
        setShowSubscribeModal(false);
        setEmail('');
      }}
    >
      <Box
        css={css`
          display: flex;
          flex-direction: column;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        `}
        className="bg-[#fafafa] dark:bg-[#09090b] rounded-lg max-w-md w-full p-6"
      >
        <h2 className="text-2xl font-bold mb-2">Subscribe to Newsletter</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          Stay updated with our latest articles, projects, and announcements.
        </p>

        <InputBox
          name="email"
          type="email"
          value={email}
          setValue={setEmail}
          placeholder="Your email address"
          icon="fi-rr-envelope"
          autoComplete="off"
        />

        <button onClick={handleSubscribe} className="btn-dark w-full">
          Subscribe
        </button>
      </Box>
    </CAModal>
  );
};

export default SubscribeModal;
