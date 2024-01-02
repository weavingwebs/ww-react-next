import { FC } from 'react';
import { HelpTextComponentProps } from '../../components';

export const BsFormText: FC<HelpTextComponentProps> = ({
  ariaDescribedBy,
  children,
}) => {
  return (
    <p className="form-text" aria-describedby={ariaDescribedBy}>
      {children}
    </p>
  );
};
