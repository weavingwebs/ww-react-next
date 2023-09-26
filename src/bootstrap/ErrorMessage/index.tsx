import clsx from 'clsx';
import { FC } from 'react';

type ErrorMessageProps = {
  className?: string;
  error: Error | null | undefined;
  prefix: string;
  reloadButton?: boolean;
};

// NOTE: Returns null if !error, so don't need to use it like this: { error && <ErrorMessage prefix="" error={error} /> },
// instead just do <ErrorMessage prefix="" error={error} />.
// Keeps the render function a bit cleaner.
export const ErrorMessage: FC<ErrorMessageProps> = ({
  error,
  className,
  prefix,
  reloadButton,
}) => {
  if (!error) {
    return null;
  }
  const errorMessage = prefix
    ? `${prefix} (Error: ${error.message})`
    : error.message;

  return (
    <div className={clsx('alert alert-danger', className)}>
      {errorMessage}
      {reloadButton && (
        <div className="mt-2">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => window.location.reload()}
          >
            Reload page
          </button>
        </div>
      )}
    </div>
  );
};
