import { FC, useEffect } from 'react';
import { useRouter } from 'next/router.js';
import { FullPageLoading } from '@weavingwebs/ww-react';

export const Redirect: FC<{
  href: string;
}> = ({ href }) => {
  const { isReady, push } = useRouter();

  useEffect(() => {
    if (!isReady) {
      return;
    }
    void push(href);
  }, [isReady, href]);

  return <FullPageLoading />;
};
