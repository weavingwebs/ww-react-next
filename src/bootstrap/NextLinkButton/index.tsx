import { BootstrapButtonProps, withButtonClasses } from '@weavingwebs/ww-react';
import { PropsWithChildren } from 'react';
import { NextLink, NextLinkProps } from '../../components';

export type NextLinkButtonProps = PropsWithChildren &
  NextLinkProps &
  BootstrapButtonProps;

export const NextLinkButton = withButtonClasses<NextLinkButtonProps>(
  (props) => <NextLink role="button" {...props} />
);
