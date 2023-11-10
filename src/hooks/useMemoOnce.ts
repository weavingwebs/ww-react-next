import { useMemo } from 'react';

export function useMemoOnce<F>(fn: () => F) {
  // @todo eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(fn, []);
}
