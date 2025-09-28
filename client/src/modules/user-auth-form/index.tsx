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

  const handleSubmit = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
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
      <section className="py-4 px-[5vw] md:px-[7vw] lg:px-[10vw] h-cover flex items-center justify-center">
        <form id="formElement" className="w-[80%] max-w-[400px]" ref={formRef}>
          <h1 className="text-4xl font-gelasio capitalize text-center mb-24">
            {type === 'login' ? 'Welcome back' : 'Join us today'}
          </h1>

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

          <button
            className="btn-dark center mt-14"
            type="submit"
            onClick={handleSubmit}
          >
            {type === 'login' ? 'Login' : 'Sign Up'}
          </button>

          <p className="mt-10 text-[#a3a3a3] text-xl text-center">
            {type === 'login'
              ? "Don't have an account ?"
              : 'Already a member ?'}
            <Link
              to={type === 'login' ? '/signup' : '/login'}
              className="text-black dark:text-[#ededed] text-xl ml-1 underline"
            >
              {type === 'login' ? 'Join us today' : 'Sign in here'}
            </Link>
          </p>
        </form>
      </section>
    </AnimationWrapper>
  );
};

export default UserAuthForm;
