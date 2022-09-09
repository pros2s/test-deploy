import { FC } from 'react';

interface ErrorMessageProps {
  message: string;
  isCheck: boolean;
}

const ErrorMessage: FC<ErrorMessageProps> = ({ message, isCheck }) => {
  return <>{isCheck && <p className='px-1 text-[13px] font-light text-orange-500'>{message}</p>}</>;
};

export default ErrorMessage;
