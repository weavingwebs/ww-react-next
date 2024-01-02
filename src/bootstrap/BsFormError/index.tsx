import { FC } from 'react';
import { FormErrorComponentProps } from '../../components';

export const BsFormError: FC<FormErrorComponentProps> = ({ id, error }) => {
  return (
    <p id={id} className="d-block invalid-feedback">
      {error.message}
    </p>
  );
};
