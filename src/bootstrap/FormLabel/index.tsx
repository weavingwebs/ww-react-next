import { CSSProperties, FC, JSX, PropsWithChildren, ReactNode } from 'react';
import clsx from 'clsx';

const RequiredIndicator: FC = () => (
  <span style={{ marginLeft: 1 }} className="text-danger">
    *
  </span>
);

type FormLabelPropsLegend = {
  as: 'legend';
};

type FormLabelPropsLabel = {
  as?: undefined;
  htmlFor: string;
};

type FormLabelProps = PropsWithChildren &
  (FormLabelPropsLegend | FormLabelPropsLabel) & {
    required?: boolean;
    style?: CSSProperties;
    className?: string;
  };

export const FormLabel: FC<FormLabelProps> = ({
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
      className={clsx('form-label', className)}
      style={style}
      {...componentProps}
    >
      <span>{children}</span>
      {required && <RequiredIndicator />}
    </Component>
  );
};
