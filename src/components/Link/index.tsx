import NextLink, { LinkProps as NextLinkProps } from 'next/link.js';
import clsx from 'clsx';
import { AnchorHTMLAttributes, FC, PropsWithChildren } from 'react';
import { isAbsoluteUrl } from '../../util';

export type LinkProps = PropsWithChildren &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof NextLinkProps> &
  NextLinkProps & {
    noLinkClass?: boolean;
  };

export const Link: FC<LinkProps> = ({
  href,
  onClick,
  noLinkClass,
  children,
  ...props
}) => {
  const className = clsx(props.className, { link: !noLinkClass });

  if (typeof href === 'string' && isAbsoluteUrl(href)) {
    return (
      <a href={href} onClick={onClick} className={className} {...props}>
        {children}
      </a>
    );
  }
  return (
    <NextLink
      className={className}
      href={href}
      onClick={(ev) => {
        if (onClick) {
          onClick(ev);
          if (ev.defaultPrevented) {
            return;
          }
        }
        if (href === window.location.pathname) {
          ev.preventDefault();
          window.location.reload();
        }
      }}
      {...props}
    >
      {children}
    </NextLink>
  );
};
