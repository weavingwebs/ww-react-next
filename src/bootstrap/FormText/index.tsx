import { FC, PropsWithChildren } from 'react';

type FormTextProps = PropsWithChildren & {
  ariaDescribedBy?: string;
};

export const FormText: FC<FormTextProps> = ({ ariaDescribedBy, children }) => {
  return (
    <p className="form-text" aria-describedby={ariaDescribedBy}>
      {children}
    </p>
  );
};
