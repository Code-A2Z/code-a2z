/** @jsxImportSource @emotion/react */
import { Badge, Box, Button } from '@mui/material';
import MailIcon from '@mui/icons-material/Mail';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import InputBox from '../../../../shared/components/atoms/input-box';
import A2ZModal from '../../../../shared/components/atoms/modal';
import A2ZTypography from '../../../../shared/components/atoms/typography';

interface SubscribeModalProps {
  subscribeEmailRef: React.RefObject<HTMLInputElement | null>;
  showSubscribeModal: boolean;
  setShowSubscribeModal: (show: boolean) => void;
  handleSubscribe: () => void;
}

const SubscribeModal = ({
  subscribeEmailRef,
  showSubscribeModal,
  setShowSubscribeModal,
  handleSubscribe,
}: SubscribeModalProps) => {
  return (
    <A2ZModal
      open={showSubscribeModal}
      onClose={() => {
        setShowSubscribeModal(false);
      }}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 450,
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <A2ZTypography
          variant="h6"
          component="h2"
          text="Subscribe to Newsletter"
        />
        <A2ZTypography
          variant="body2"
          component="p"
          text="Stay updated with our latest articles, projects, and announcements."
        />

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: 2,
          }}
        >
          <InputBox
            id="subscribe-email"
            name="email"
            type="email"
            placeholder="Your email address"
            inputRef={subscribeEmailRef}
            icon={<MailIcon />}
            autoComplete="off"
            fullWidth
          />

          <Button
            onClick={handleSubscribe}
            variant="outlined"
            sx={{
              height: '56px',
            }}
          >
            <Badge>
              <CardMembershipIcon />
            </Badge>
          </Button>
        </Box>
      </Box>
    </A2ZModal>
  );
};

export default SubscribeModal;
