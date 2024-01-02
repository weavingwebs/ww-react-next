import { FC } from 'react';
import { FormErrorComponentProps } from '../../components';

export const BsFormError: FC<FormErrorComponentProps> = ({ id, error }) => {
  return (
    <span id={id} className="d-block invalid-feedback">
      {error.message}
    </span>
  );
};
