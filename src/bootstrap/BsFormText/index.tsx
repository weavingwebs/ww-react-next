import { FC } from 'react';
import { HelpTextComponentProps } from '../../components';

export const BsFormText: FC<HelpTextComponentProps> = ({
  ariaDescribedBy,
  children,
}) => {
  return (
    <span className="form-text" aria-describedby={ariaDescribedBy}>
      {children}
    </span>
  );
};
