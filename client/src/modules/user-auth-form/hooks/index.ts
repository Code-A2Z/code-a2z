import { FormEvent, useState } from 'react';
import { emailRegex, passwordRegex } from '../../../shared/utils/regex';
import { useNotifications } from '../../../shared/hooks/use-notification';
import { login, signUp } from '../../../infra/rest/apis/auth';
import { useSetAtom } from 'jotai';
import { UserAtom } from '../../../infra/states/user';
import { useSetAtom as useSetAtomGeneric } from 'jotai';
import { TokenAtom } from '../../../infra/states/auth';
import { setAccessToken } from '../../../shared/utils/local';
import { ErrorResponse } from '../../../infra/rest/typings';
import { useNavigate } from 'react-router-dom';

export const useUserAuthForm = ({ type }: { type: string }) => {
  const { addNotification } = useNotifications();
  const [loading, setLoading] = useState<boolean>(false);
  const setUser = useSetAtom(UserAtom);
  const setToken = useSetAtomGeneric(TokenAtom);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    let response;
    try {
      if (!e.currentTarget) return;

      const form = new FormData(e.currentTarget);
      const formData = {
        email: '',
        password: '',
        fullname: '',
      };

      for (const [key, value] of form.entries()) {
        if (key === 'email' || key === 'password' || key === 'fullname') {
          formData[key] = value as string;
        }
      }

      const { fullname, email, password } = formData;
      if (type !== 'login') {
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
            'Password must be at least 6 characters and include uppercase, lowercase, and a number',
          type: 'error',
        });
      }

      response =
        type === 'login'
          ? await login({ email, password })
          : await signUp({ fullname, email, password });
      addNotification({
        message: response.message,
        type: response.status,
      });
      if (response.status === 'success') {
        setUser(response.data?.user ?? null);
        setAccessToken(response.data?.access_token || '');
        setToken(response.data?.access_token || null);
        navigate('/');
      }
    } catch (error) {
      console.error('Error in form submission:', error);
      addNotification({
        message:
          (error as ErrorResponse)?.response?.data?.message ??
          'An error occurred. Please try again.',
        type: (error as ErrorResponse)?.response?.data?.status ?? 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    handleSubmit,
  };
};
