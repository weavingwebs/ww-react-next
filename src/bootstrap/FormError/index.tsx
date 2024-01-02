import { FC, PropsWithChildren } from 'react';

type FormErrorProps = PropsWithChildren & {
  id?: string;
};

/** @deprecated Use BsFormError instead. */
export const FormError: FC<FormErrorProps> = ({ id, children }) => {
  return (
    <span id={id} className="d-block invalid-feedback">
      {children}
    </span>
  );
};
