import { Meta } from '@storybook/react';
import { FC } from 'react';
import { NextLink } from '../../components';
import { NextLinkButton } from '../../bootstrap';

export const LinkButtonStory: FC = () => {
  return (
    <div>
      <h1>LinkButton examples</h1>
      <div className="mb-3">
        <NextLink href="/#">Regular link</NextLink>
      </div>
      <div className="mb-3">
        <NextLink href="/#" target="_blank">
          Link with target blank
        </NextLink>
      </div>
      <div className="mb-3">
        <NextLinkButton variant="dark" href="/#">
          Regular link button
        </NextLinkButton>
      </div>
      <div>
        <NextLinkButton variant="primary" href="/#" target="_blank">
          Link button with target blank
        </NextLinkButton>
      </div>
    </div>
  );
};

export default {
  title: 'Components/LinkButton',
  component: LinkButtonStory,
} as Meta<typeof LinkButtonStory>;
