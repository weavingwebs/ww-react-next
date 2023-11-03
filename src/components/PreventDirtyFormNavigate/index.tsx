import { memo, useEffect } from 'react';
import { Control, useFormContext, useFormState } from 'react-hook-form';
import { useRouter } from 'next/router';

export function usePreventNavigate(prevent: boolean) {
  const router = useRouter();
  useEffect(() => {
    if (!prevent) {
      return;
    }
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    const handleRouteChangeStart = (url: string) => {
      if (url !== router.asPath) {
        if (
          // eslint-disable-next-line no-alert
          !window.confirm(
            'Are you sure you wish to leave this page? Changes that you made will not be saved.'
          )
        ) {
          router.events.emit('routeChangeError');
          // https://github.com/vercel/next.js/discussions/32231
          // eslint-disable-next-line no-throw-literal
          throw 'routeChange aborted.';
        }
      }
    };
    router.events.on('routeChangeStart', handleRouteChangeStart);

    // eslint-disable-next-line consistent-return
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      router.events.off('routeChangeStart', handleRouteChangeStart);
    };
  }, [prevent, router]);
}

// // Use inside React Hook Forms only.
export const PreventDirtyFormNavigate = memo(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (props: { control?: Control<any> }) => {
    const formContext = useFormContext<any>();
    let { control } = props;
    if (!control) {
      if (!formContext) {
        throw new Error(
          'You must either set the control prop or wrap this component with a FormProvider'
        );
      }
      control = formContext.control;
    }
    const { isDirty, isSubmitting } = useFormState({ control });
    usePreventNavigate(isDirty && !isSubmitting);
    return null;
  }
);

PreventDirtyFormNavigate.displayName = 'PreventDirtyNavigate';
