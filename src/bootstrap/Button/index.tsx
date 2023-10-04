import * as React from 'react';
import clsx from 'clsx';

// @todo: type is repeated.
type BootstrapColourVariants =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'dark'
  | 'light';

type BootstrapButtonProps = {
  type?: 'button' | 'submit';
  variant: BootstrapColourVariants | 'link';
  size?: 'sm' | 'lg';
  fullWidth?: boolean;
  outlined?: boolean;
  isActive?: boolean;
  className?: string;
};

function withButtonClasses<P = object>(
  Component: React.ComponentType<P>
): React.FC<P & BootstrapButtonProps> {
  const wrappedWithButtonClasses: React.FC<P & BootstrapButtonProps> = ({
    className,
    variant,
    size,
    fullWidth,
    outlined,
    isActive,
    ...props
  }) => (
    <Component
      className={clsx(
        'btn',
        size && `btn-${size}`,
        fullWidth && 'w-100',
        outlined ? `btn-outline-${variant}` : `btn-${variant}`,
        { active: isActive },
        className
      )}
      {...(props as unknown as P)}
    />
  );
  wrappedWithButtonClasses.displayName = `withButtonClasses(${
    Component.displayName || Component.name
  })`;
  return wrappedWithButtonClasses;
}

// export type LinkButtonProps = React.PropsWithChildren &
//   LinkProps &
//   BootstrapButtonProps;
//
// export const LinkButton: React.FC<LinkButtonProps> = withButtonClasses(
//   (props) => <Link role="button" noLinkClass {...props} />
// );

export type ButtonProps = BootstrapButtonProps &
  React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button: React.FC<ButtonProps> = withButtonClasses((props) => (
  <button {...props} />
));
