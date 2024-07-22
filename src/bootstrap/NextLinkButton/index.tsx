import * as React from 'react';
import { BootstrapButtonProps, withButtonClasses } from '@weavingwebs/ww-react';
import { NextLink, NextLinkProps } from '../../components';

export type NextLinkButtonProps = React.PropsWithChildren &
  NextLinkProps &
  BootstrapButtonProps;

export const NextLinkButton: React.FC<NextLinkButtonProps> = withButtonClasses(
  (props: React.PropsWithChildren & BootstrapButtonProps) => (
    <NextLink role="button" {...props} />
  )
);
