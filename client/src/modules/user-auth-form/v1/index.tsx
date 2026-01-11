import { Box, styled, Typography } from '@mui/material';
import InputBox from '../../../shared/components/atoms/input-box';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import PasswordIcon from '@mui/icons-material/Password';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import LoginIcon from '@mui/icons-material/Login';
import A2ZButton from '../../../shared/components/atoms/button';
import { useUserAuthForm } from './hooks';
import { useState } from 'react';
import A2ZTypography from '../../../shared/components/atoms/typography';

const StyledSection = styled('section')(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
  paddingLeft: '5vw',
  paddingRight: '5vw',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
}));

const StyledForm = styled('form')(() => ({
  width: '80%',
  maxWidth: 400,
}));

const StyledTitle = styled(Typography)(({ theme }) => ({
  fontSize: '2.5rem',
  fontFamily: 'Gelasio, serif',
  textTransform: 'capitalize',
  textAlign: 'center',
  marginBottom: theme.spacing(6),
}));

const StyledFooter = styled('p')(({ theme }) => ({
  marginTop: theme.spacing(6),
  color: theme.palette.text.secondary,
  fontSize: '1.125rem',
  textAlign: 'center',
}));

const UserAuthForm = () => {
  const [formType, setFormType] = useState<string>('login');
  const { loading, handleSubmit } = useUserAuthForm({ type: formType });

  return (
    <StyledSection>
      <StyledForm id="formElement" onSubmit={handleSubmit}>
        <StyledTitle>
          {formType === 'login' ? 'Welcome back' : 'Join us today'}
        </StyledTitle>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
          }}
        >
          {formType !== 'login' && (
            <InputBox
              id="auth-form-fullname"
              name="fullname"
              type="text"
              placeholder="Full Name"
              fullWidth
              icon={<PersonIcon />}
            />
          )}

          <InputBox
            id="auth-form-email"
            name="email"
            type="email"
            placeholder="Email"
            fullWidth
            icon={<EmailIcon />}
          />

          <InputBox
            id="auth-form-password"
            name="password"
            type="password"
            placeholder="Password"
            fullWidth
            icon={<PasswordIcon />}
          />

          <A2ZButton
            type="submit"
            sx={{
              mt: 2,
              display: 'flex',
              gap: 1,
            }}
            loading={loading}
            loadingPosition="end"
          >
            {formType === 'login' ? 'Login' : 'Sign Up'}
            {formType === 'login' ? <LoginIcon /> : <AppRegistrationIcon />}
          </A2ZButton>
        </Box>

        <StyledFooter>
          {formType === 'login'
            ? "Don't have an account ?"
            : 'Already a member ?'}{' '}
          <A2ZTypography
            text={formType === 'login' ? 'Join us today' : 'Sign in here'}
            component="span"
            props={{
              onClick: () =>
                setFormType(formType === 'login' ? 'signup' : 'login'),
              sx: {
                fontSize: '1.125rem',
                marginLeft: 1,
                textDecoration: 'underline',
                color: 'inherit',
                cursor: 'pointer',
                '&:hover': {
                  opacity: 0.8,
                },
              },
            }}
          />
        </StyledFooter>
      </StyledForm>
    </StyledSection>
  );
};

export default UserAuthForm;
