import { ChangeEvent, FC, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { SubmitHandler, useForm } from 'react-hook-form';

import useAuth from '../hooks/useAuth';
import { useTypedDispatch } from '../hooks/useTypedDispatch';

import { passwordIsChanging, passwordIsNotChanging } from '../store/slices/privateSettings';
import Loader from './Loader';

interface Passwords {
  repeatNewPassword: string;
}

const PasswordChanging: FC = () => {
  const dispatch = useTypedDispatch();
  const { reAuth, setNewPassword, loading } = useAuth();

  const [passwordValue, setPasswordValue] = useState<string>('');
  const [newPasswordValue, setNewPasswordValue] = useState<string>('');
  const [isWeakPassword, setIsWeakPassword] = useState<boolean>(false);
  const [isEqualNewPasswords, setIsEqualNewPasswords] = useState<boolean>(true);

  const [isPasswordCorrect, setIsPasswordCorrect] = useState<boolean>(true);
  const [isPasswordConfirmed, setIsPasswordConfirmed] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Passwords>();

  const confirmCurrentPassword = () => {
    setIsPasswordConfirmed(true);
    setIsPasswordCorrect(true);

    if (!passwordValue) {
      setIsPasswordConfirmed(false);
      setIsWeakPassword(true);
      return;
    }

    reAuth(passwordValue).catch((error) => {
      setIsPasswordConfirmed(false);
      error.message.match(/wrong-password/gi) ? setIsPasswordCorrect(false) : alert(error.message);
    });
  };

  const handleInputsChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!isPasswordConfirmed) {
      setIsPasswordCorrect(true);
      setIsWeakPassword(false);
      setPasswordValue(e.target.value);
    } else {
      setNewPasswordValue(e.target.value);
      setIsWeakPassword(false);
    }
  };

  const onSubmit: SubmitHandler<Passwords> = async (data) => {
    if (!isPasswordConfirmed) {
      confirmCurrentPassword();
      return;
    }

    if (newPasswordValue === data.repeatNewPassword) {
      if (newPasswordValue.length < 6) {
        setIsWeakPassword(true);
        return;
      }

      await setNewPassword(newPasswordValue);
      setIsEqualNewPasswords(true);
      !isWeakPassword && dispatch(passwordIsNotChanging());
    } else if (newPasswordValue) {
      setIsEqualNewPasswords(false);
    }
  };

  return (
    <div className='relative flex h-screen w-screen flex-col bg-black md:items-center md:justify-center md:bg-transparent selection:bg-red-600 selection:text-white'>
      <Head>
        <title>Netflix</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <header className='border-b border-white/10 bg-[#141414]'>
        <Link href='/'>
          <img
            src='https://rb.gy/ulxxee'
            alt='Netflix'
            width={150}
            height={90}
            className='cursor-pointer object-contain'
          />
        </Link>
      </header>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className='relative mt-24 space-y-8 rounded bg-black/75 py-5 px-6 md:mt-0 md:max-w-xl md:px-14'>
        <h1 className='text-4xl font-semibold'>
          {!isPasswordConfirmed ? 'Enter your password' : 'Enter your new password'}
        </h1>

        <div className='space-y-4'>
          <label className='inline-block w-full'>
            <input
              value={!isPasswordConfirmed ? passwordValue : newPasswordValue}
              onChange={(e) => handleInputsChange(e)}
              type='password'
              placeholder={!isPasswordConfirmed ? 'Your password' : 'New Password'}
              className='input'
            />
            {!isPasswordCorrect && (
              <p className='absolute text-sm text-red-600 pl-2 '>Wrong password. Try again</p>
            )}
            {(isWeakPassword) && (
              <p className='absolute text-sm text-red-600 pl-2 '>
                Password should be at least 6 characters
              </p>
            )}
          </label>

          {isPasswordConfirmed && (
            <label className='inline-block w-full pt-4'>
              <input
                type='password'
                placeholder='Repeat new password'
                className='input'
                {...register('repeatNewPassword', {
                  required: true,
                  onChange: () => setIsEqualNewPasswords(true),
                })}
              />
              {errors.repeatNewPassword && (
                <p className='p-1 text-[13px] font-light  text-orange-500'>
                  Your password must contain between 6 and 60 characters.
                </p>
              )}
              {!isEqualNewPasswords && (
                <p className='p-1 text-[13px] font-light  text-orange-500'>
                  Passwords are not equal.
                </p>
              )}
            </label>
          )}
        </div>

        <button className='w-full rounded bg-[#e50914] py-3 font-semibold' type='submit'>
          {loading ? (
            <Loader color='dark:fill-gray-300' />
          ) : !isPasswordConfirmed ? (
            'Next'
          ) : (
            'Confirm'
          )}
        </button>

        <button
          className='membershipLink text-center w-full'
          onClick={() => dispatch(passwordIsNotChanging())}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default PasswordChanging;
