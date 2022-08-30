import { FC, useEffect, useState } from 'react';
import { collection, DocumentData, onSnapshot } from 'firebase/firestore';
import ReactPlayer from 'react-player';
import { Toaster } from 'react-hot-toast';

import {
  CheckIcon,
  PlusIcon,
  ThumbUpIcon,
  VolumeOffIcon,
  VolumeUpIcon,
  XIcon,
} from '@heroicons/react/outline';
import { FaPlay } from 'react-icons/fa';
import MuiModal from '@mui/material/Modal';

import { useTypedSelector } from '../hooks/useTypedSelector';
import { useTypedDispatch } from '../hooks/useTypedDispatch';
import { useFetch } from '../hooks/useFetch';
import useAuth from '../hooks/useAuth';

import { closeModal, modalSelector, toggleMuteVideo } from '../store/slices/modal';
import { movieSelector } from '../store/slices/movie';
import { Genre, Movie } from '../types';
import { db } from '../firebase';
import { handleList } from '../utils/toast';

const Modal: FC = () => {
  const dispatch = useTypedDispatch();
  const { isOpenedModal, isMutedVideo } = useTypedSelector(modalSelector);
  const { movie } = useTypedSelector(movieSelector);
  const { user } = useAuth();

  const [isMovieAdded, setIsMovieAdded] = useState<boolean>(false);
  const [trailer, setTrailer] = useState<string>('');
  const [movies, setMovies] = useState<DocumentData[] | Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { genresArr, trailerId } = await useFetch(movie);
      setTrailer(trailerId);
      setGenres(genresArr);
    };

    fetchData();
  }, [movie]);

  useEffect(() => {
    if (user) {
      return onSnapshot(collection(db, 'users', user.uid, 'myList'), (snapshot) =>
        setMovies(snapshot.docs),
      );
    }
  }, [db, movie?.id]);

  useEffect(
    () => setIsMovieAdded(movies.findIndex((elem) => elem.data().id === movie?.id) !== -1),
    [movies],
  );

  return (
    <MuiModal
      className='fixed !top-7 left-0 right-0 z-50 mx-auto w-full max-w-5xl overflow-hidden overflow-y-scroll rounded-md scrollbar-hide'
      open={isOpenedModal}
      onClose={() => dispatch(closeModal())}>
      <>
        <Toaster position='bottom-center' />

        <button
          className='modalButton absolute right-5 top-5 !z-40 h-9 w-9 border-0 bg-[#181818] hover:rotate-90 hover:bg-[#181818] hover:border-2'
          onClick={() => dispatch(closeModal())}>
          <XIcon className='h-6 w-6' />
        </button>

        <div className='relative pt-[56.25%]'>
          <ReactPlayer
            url={`https://www.youtube.com/watch?v=${trailer}`}
            width='100%'
            height='100%'
            style={{ position: 'absolute', top: '0', left: '0' }}
            playing
            volume={0.25}
            config={{
              youtube: {
                playerVars: { showinfo: 1 },
              },
            }}
            muted={isMutedVideo}
          />

          <div className='absolute bottom-10 flex w-full items-center justify-between px-10'>
            <ul className='flex space-x-2'>
              <li>
                <button className='flex items-center gap-x-2 rounded bg-white py-2 px-8 text-xl font-bold text-black transition hover:bg-[#e6e6e6]'>
                  <FaPlay className='h-7 w-7 text-black' />
                  Play
                </button>
              </li>

              <li>
                <button
                  className='modalButton'
                  onClick={() => handleList(user, isMovieAdded, movie)}>
                  {isMovieAdded ? (
                    <CheckIcon className='h-7 w-7' />
                  ) : (
                    <PlusIcon className='h-7 w-7' />
                  )}
                </button>
              </li>

              <li>
                <button className='modalButton'>
                  <ThumbUpIcon className='h-6 w-6' />
                </button>
              </li>
            </ul>

            <button className='modalButton' onClick={() => dispatch(toggleMuteVideo())}>
              {isMutedVideo ? (
                <VolumeOffIcon className='h-6 w-6' />
              ) : (
                <VolumeUpIcon className='h-6 w-6' />
              )}
            </button>
          </div>
        </div>

        <div className='flex space-x-16 rounded-b-md bg-[#181818] px-10 py-8'>
          <div className='space-y-6 text-lg'>
            <ul className='flex items-center space-x-2 text-sm'>
              <li className='font-semibold text-green-400'>
                {(movie!.vote_average * 10).toFixed(2)}% Match
              </li>
              <li className='font-light'>{movie?.release_date || movie?.first_air_date}</li>
              <li className='flex h-4 items-center justify-center rounded border border-white/40 px-1.5 text-xs'>
                HD
              </li>
            </ul>

            <div className='flex flex-col gap-x-10 gap-y-4 font-light md:flex-row'>
              <p className='w-5/6'>{movie?.overview}</p>

              <ul className='flex flex-col space-y-3 text-sm'>
                <li>
                  <p>
                    <span className='text-[gray]'>Genres:</span>{' '}
                    {genres.map((genre) => genre.name).join(', ')}
                  </p>
                </li>

                <li>
                  <p>
                    <span className='text-[gray]'>Original language:</span>{' '}
                    {movie?.original_language}
                  </p>
                </li>

                <li>
                  <p>
                    <span className='text-[gray]'>Total votes:</span> {movie?.vote_count}
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </>
    </MuiModal>
  );
};

export default Modal;
