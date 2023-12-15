import { useRouter } from 'next/router.js';

export const useNavigate = () => {
  const router = useRouter();

  return (url: string) => {
    return router.push(url);
  };
};
