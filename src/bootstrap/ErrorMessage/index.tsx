import clsx from 'clsx';
import { FC, PropsWithChildren } from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';

function unwrapErrorToString(err: Error) {
  let errStr = err.message;
  if (err.cause instanceof Error) {
    errStr += `: ${unwrapErrorToString(err.cause)}`;
  }
  return errStr;
}

type ErrorMessageProps = PropsWithChildren & {
  className?: string;
  error: Error | null;
  prefix?: string;
  reloadButton?: boolean;
};

// NOTE: Returns null if !error, so don't need to use it like this: { error && <ErrorMessage prefix="" error={error} /> },
// instead just do <ErrorMessage error={error} />.
// Keeps the render function a bit cleaner.
export const ErrorMessage: FC<ErrorMessageProps> = ({
  error,
  className,
  prefix,
  reloadButton,
  children,
}) => {
  if (!error) {
    return null;
  }

  let errorMessage = unwrapErrorToString(error);
  if (prefix) {
    errorMessage = `${prefix}: ${errorMessage}`;
  }

  return (
    <div className={clsx('alert alert-danger', className)}>
      <FaExclamationTriangle className="me-2" />
      {errorMessage}
      {children}
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
