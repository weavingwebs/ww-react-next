import LinkFromNext, { LinkProps as LinkFromNextProps } from 'next/link.js';
import clsx from 'clsx';
import { AnchorHTMLAttributes, FC, PropsWithChildren } from 'react';
import { isAbsoluteUrl } from '@weavingwebs/ww-react';

export type NextLinkProps = PropsWithChildren &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkFromNextProps> &
  LinkFromNextProps & {
    noLinkClass?: boolean;
  };

export const NextLink: FC<NextLinkProps> = ({
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
    <LinkFromNext
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
    </LinkFromNext>
  );
};
