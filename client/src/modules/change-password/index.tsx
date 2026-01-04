import { useRef, useState } from 'react';
import { useNotifications } from '../../shared/hooks/use-notification';
import { passwordRegex } from '../../shared/utils/regex';
import { changePassword } from '../../infra/rest/apis/auth';
import InputBox from '../../shared/components/atoms/input-box';
import { Box, Button, Stack, CircularProgress } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VpnKeyOutlinedIcon from '@mui/icons-material/VpnKeyOutlined';
import A2ZTypography from '../../shared/components/atoms/typography';

const ChangePassword = () => {
  const changePasswordForm = useRef<HTMLFormElement>(null);
  const { addNotification } = useNotifications();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!changePasswordForm.current) return;
    const form = new FormData(changePasswordForm.current);
    const formData: { [key: string]: string } = {};

    for (const [key, value] of form.entries()) {
      formData[key] = value as string;
    }

    const { currentPassword, newPassword } = formData;

    if (!currentPassword.length || !newPassword.length) {
      addNotification({
        message: 'Please fill all the fields',
        type: 'error',
      });
      return;
    }

    if (
      !passwordRegex.test(currentPassword) ||
      !passwordRegex.test(newPassword)
    ) {
      addNotification({
        message:
          'Password should be atleast 6 characters long and contain atleast one uppercase letter, one lowercase letter and one number',
        type: 'error',
      });
      return;
    }

    setLoading(true);

    try {
      await changePassword({
        current_password: currentPassword,
        new_password: newPassword,
      });
      addNotification({
        message: 'Password Updated!',
        type: 'success',
      });
      if (changePasswordForm.current) {
        changePasswordForm.current.reset();
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } };
      addNotification({
        message: err.response?.data?.error || 'Failed to update password',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component="form"
      ref={changePasswordForm}
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        maxWidth: 500,
        width: '100%',
        py: 4,
      }}
    >
      <A2ZTypography
        variant="h5"
        text="Change Password"
        props={{ fontWeight: 600 }}
      />

      <Stack spacing={3}>
        <InputBox
          id="change-password--current"
          name="currentPassword"
          type="password"
          placeholder="Current Password"
          icon={<LockOutlinedIcon />}
          disabled={loading}
        />
        <InputBox
          id="change-password--new"
          name="newPassword"
          type="password"
          placeholder="New Password"
          icon={<VpnKeyOutlinedIcon />}
          disabled={loading}
        />
      </Stack>
      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={loading}
        sx={{
          mt: 2,
          py: 1.2,
          fontSize: '1rem',
          borderRadius: 2,
          textTransform: 'none',
          fontWeight: 500,
        }}
      >
        {loading ? <CircularProgress size={24} /> : 'Change Password'}
      </Button>
    </Box>
  );
};

export default ChangePassword;
