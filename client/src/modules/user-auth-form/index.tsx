import { Link, Navigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import InputBox from '../../shared/components/atoms/input-box';
import AnimationWrapper from '../../shared/components/atoms/page-animation';
import { UserAtom } from '../../shared/states/user';
import { emailRegex, passwordRegex } from '../../shared/utils/regex';
import { subscribeUser } from '../../shared/components/molecules/navbar/requests';
import { authorizeUser } from './requests';
import { useNotifications } from '../../shared/hooks/use-notification';
import React from 'react';
import { AuthorizeUserPayload } from './typings';
import { Button, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

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
  marginTop: theme.spacing(2.5),
  color: theme.palette.text.secondary,
  fontSize: '1.125rem',
  textAlign: 'center',
}));

const UserAuthForm = ({ type }: { type: string }) => {
  const [userAuth, setUserAuth] = useAtom(UserAtom);
  const { addNotification } = useNotifications();

  const userAuthThroughServer = async (
    serverRoute: string,
    formData: AuthorizeUserPayload
  ) => {
    if (serverRoute === '/api/auth/signup') {
      const { email } = formData;
      await subscribeUser(email);
    }
    const response = await authorizeUser(serverRoute, formData);
    if (response.access_token) {
      setUserAuth({
        access_token: response.access_token,
        profile_img: response.profile_img,
        username: response.username,
        fullname: response.fullname,
        name: response.fullname, // Use fullname as name
        email: response.email,
        role: response.role,
        new_notification_available: false,
      });
      addNotification({
        message: 'Logged in successfully!',
        type: 'success',
      });
    }
  };

  const formRef = React.useRef<HTMLFormElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();

    const serverRoute =
      type == 'login' ? '/api/auth/login' : '/api/auth/signup';

    if (!formRef.current) return;

    const form = new FormData(formRef.current);
    const formData: AuthorizeUserPayload = {
      email: '',
      password: '',
      fullname: '',
    };

    for (const [key, value] of form.entries()) {
      if (key === 'email' || key === 'password' || key === 'fullname') {
        formData[key as keyof AuthorizeUserPayload] = value as string;
      }
    }

    const { fullname, email, password } = formData;

    if (fullname) {
      if (fullname.length < 3) {
        return addNotification({
          message: 'Full name should be atleast 3 letters long',
          type: 'error',
        });
      }
    }
    if (!email.length) {
      return addNotification({
        message: 'Email is required',
        type: 'error',
      });
    }

    if (!emailRegex.test(email)) {
      return addNotification({
        message: 'Invalid email',
        type: 'error',
      });
    }
    if (!passwordRegex.test(password)) {
      return addNotification({
        message:
          'Password should be atleast 6 characters long and contain atleast one uppercase letter, one lowercase letter and one number',
        type: 'error',
      });
    }
    userAuthThroughServer(serverRoute, formData);
  };

  return userAuth?.access_token ? (
    <Navigate to="/" />
  ) : (
    <AnimationWrapper keyValue={type}>
      <StyledSection>
        <StyledForm id="formElement" onSubmit={handleSubmit}>
          <StyledTitle>
            {type === 'login' ? 'Welcome back' : 'Join us today'}
          </StyledTitle>

          {type !== 'login' ? (
            <InputBox
              name="fullname"
              type="text"
              placeholder="Full Name"
              icon="fi-rr-user"
            />
          ) : (
            ''
          )}

          <InputBox
            name="email"
            type="email"
            placeholder="Email"
            icon="fi-rr-envelope"
          />

          <InputBox
            name="password"
            type="password"
            placeholder="Password"
            icon="fi-rr-key"
          />

          <Button
            type="submit"
            variant="contained"
            sx={theme => ({
              borderRadius: '999px',
              bgcolor: theme.palette.mode === 'dark' ? '#e4e4e7' : '#1f1f1f',
              color: theme.palette.mode === 'dark' ? '#1a1a1a' : '#f1f1f1',
              padding: theme.spacing(1.5, 3),
              fontSize: '1.125rem',
              textTransform: 'none',
              '&:hover': {
                opacity: 0.9,
              },
              mt: 3.5,
              mx: 'auto',
              display: 'block',
            })}
          >
            {type === 'login' ? 'Login' : 'Sign Up'}
          </Button>

          <StyledFooter>
            {type === 'login'
              ? "Don't have an account ?"
              : 'Already a member ?'}
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
    </AnimationWrapper>
  );
};

export default UserAuthForm;
