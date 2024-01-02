import { FC, JSX } from 'react';
import clsx from 'clsx';
import { FormLabelProps } from '../../components';

export const RequiredIndicator: FC = () => (
  <span style={{ marginLeft: 1 }} className="text-danger">
    *
  </span>
);

export const BsFormLabel: FC<FormLabelProps> = ({
  required,
  className,
  style,
  children,
  ...asProps
}) => {
  const { as, ...componentProps } = asProps;
  let Component: keyof JSX.IntrinsicElements;

  switch (as) {
    case 'legend': {
      Component = 'legend';
      break;
    }
    default: {
      Component = 'label';
    }
  }

  return (
    <Component
      className={clsx('form-label fs-6', className)}
      style={style}
      {...componentProps}
    >
      <span>{children}</span>
      {required && <RequiredIndicator />}
    </Component>
  );
};
