import { FC, useEffect } from 'react';
import { useRouter } from 'next/router';
import { FullPageLoading } from '../../bootstrap';

export const Redirect: FC<{
  href: string;
}> = ({ href }) => {
  const { isReady, push } = useRouter();

  useEffect(() => {
    if (!isReady) {
      return;
    }
    void push(href);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady, href]);

  return <FullPageLoading />;
};
