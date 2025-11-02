import { useRef } from 'react';
import { useNotifications } from '../../shared/hooks/use-notification';
import { passwordRegex } from '../../shared/utils/regex';
import { changePassword } from '../../infra/rest/apis/auth';
import InputBox from '../../shared/components/atoms/input-box';
import { Box, Button, Typography, Stack } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VpnKeyOutlinedIcon from '@mui/icons-material/VpnKeyOutlined';

const ChangePassword = () => {
  const changePasswordForm = useRef<HTMLFormElement>(null);
  const { addNotification } = useNotifications();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
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

    e.currentTarget.setAttribute('disabled', 'true');

    changePassword({
      current_password: currentPassword,
      new_password: newPassword,
    })
      .then(() => {
        e.currentTarget.removeAttribute('disabled');
        return addNotification({
          message: 'Password Updated!',
          type: 'success',
        });
      })
      .catch(({ response }) => {
        e.currentTarget.removeAttribute('disabled');
        return addNotification({
          message: response.data.error,
          type: 'error',
        });
      });
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
        maxWidth: 400,
        width: '100%',
        py: 6,
      }}
    >
      <Typography variant="h5" fontWeight={600}>
        Change Password
      </Typography>

      <Stack spacing={3}>
        <InputBox
          id="change-password--current"
          name="currentPassword"
          type="password"
          placeholder="Current Password"
          icon={<LockOutlinedIcon />}
        />
        <InputBox
          id="change-password--new"
          name="newPassword"
          type="password"
          placeholder="New Password"
          icon={<VpnKeyOutlinedIcon />}
        />
      </Stack>
      <Button
        type="submit"
        variant="contained"
        color="primary"
        sx={{
          mt: 2,
          py: 1.2,
          fontSize: '1rem',
          borderRadius: 2,
          textTransform: 'none',
          fontWeight: 500,
        }}
      >
        Change Password
      </Button>
    </Box>
  );
};

export default ChangePassword;
