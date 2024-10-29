import { FC, useEffect } from 'react';
import { useRouter } from 'next/router.js';
import { FullPageLoading } from '@weavingwebs/ww-react';

export const Redirect: FC<{
  href: string;
}> = ({ href }) => {
  const { isReady, replace } = useRouter();

  useEffect(() => {
    if (!isReady) {
      return;
    }
    void replace(href);
  }, [isReady, href]);

  return <FullPageLoading />;
};
