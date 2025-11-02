import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../shared/hooks/use-auth';
import { Box, CircularProgress, styled, Typography } from '@mui/material';
import InputBox from '../../shared/components/atoms/input-box';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import PasswordIcon from '@mui/icons-material/Password';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import LoginIcon from '@mui/icons-material/Login';
import A2ZButton from '../../shared/components/atoms/button';
import { useUserAuthForm } from './hooks';

const StyledSection = styled('section')(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
  paddingLeft: '5vw',
  paddingRight: '5vw',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: `calc(100vh - 80px)`,
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

const UserAuthForm = ({ type }: { type: string }) => {
  const { isAuthenticated } = useAuth();
  const { loading, handleSubmit } = useUserAuthForm({ type });

  return isAuthenticated() ? (
    <Navigate to="/" />
  ) : (
    <StyledSection>
      <StyledForm id="formElement" onSubmit={handleSubmit}>
        <StyledTitle>
          {type === 'login' ? 'Welcome back' : 'Join us today'}
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
          {type !== 'login' && (
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
            {type === 'login' ? 'Login' : 'Sign Up'}
            {!loading ? (
              type === 'login' ? (
                <LoginIcon />
              ) : (
                <AppRegistrationIcon />
              )
            ) : (
              <CircularProgress size={18} />
            )}
          </A2ZButton>
        </Box>

        <StyledFooter>
          {type === 'login' ? "Don't have an account ?" : 'Already a member ?'}
          <Link
            to={type === 'login' ? '/signup' : '/login'}
            style={{
              marginLeft: 8,
              textDecoration: 'underline',
              color: 'inherit',
            }}
          >
            {type === 'login' ? 'Join us today' : 'Sign in here'}
          </Link>
        </StyledFooter>
      </StyledForm>
    </StyledSection>
  );
};

export default UserAuthForm;
