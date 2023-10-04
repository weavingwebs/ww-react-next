import { FC, PropsWithChildren } from 'react';

type FormErrorProps = PropsWithChildren & {
  id?: string;
};

export const FormError: FC<FormErrorProps> = ({ id, children }) => {
  return (
    <p id={id} className="d-block invalid-feedback">
      {children}
    </p>
  );
};
