import { FC } from 'react';
import Link from 'next/link';
import Head from 'next/head';

import Header from '../components/UI/Header';
import Modal from '../components/Modal';
import Thumbnail from '../components/Thumbnail';
import Footer from '../components/UI/Footer';

import useAuth from '../hooks/useAuth';
import { useMovieList } from '../hooks/useMovieList';
import { useTypedSelector } from '../hooks/useTypedSelector';

import { modalSelector } from '../store/slices/modal';

const liked: FC = () => {
  const { isOpenedModal } = useTypedSelector(modalSelector);
  const { loading, user } = useAuth();
  const likedList = useMovieList(user?.uid, 'Liked');

  if (loading) return null;

  return (
    <div className='relative'>
      <Head>
        <title>Liked</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Header />
      <main className='flex flex-col items-center selection:bg-red-600 selection:text-white overflow-x-hidden md:pr-8 pt-20 min-h-screen md:pl-4 lg:pl-20 lg:pr-36'>
        <h1 className='text-3xl font-semibold lg:ml-14 mb-5 md:mb-14 lg:mb-16'>Liked</h1>

        {likedList.length === 0 ? (
          <h3 className='text-lg text-center px-3 md:text-xl md:mb-[70px] lg:ml-14'>
            Hmm.. Your <span className='text-red-600 font-bold'>liked list</span> is empty. Why
            would you not go{' '}
            <Link href={'/'}>
              <span className='border-b-[1px] transition duration-150 cursor-pointer md:hover:border-b-red-600'>
                back home
              </span>
            </Link>{' '}
            and like some movies.
          </h3>
        ) : (
          <>
            <div className='md:pr-[55px] lg:pr-0'>
              <div className='flex flex-wrap items-center justify-center h-full gap-3 md:gap-6 mdmax:overflow-x-hidden md:pt-10 md:ml-0.5 md:-mx-[60px] md:mb-[70px]'>
                {likedList.map((movie) => (
                  <Thumbnail movie={movie} />
                ))}
              </div>
            </div>
            {isOpenedModal && <Modal />}
          </>
        )}

        <div className='md:-ml-48 lg:-ml-[120px]'>
          <Footer isAbsolute={true} />
        </div>
      </main>
    </div>
  );
};

export default liked;