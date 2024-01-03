import { Meta } from '@storybook/react';
import { FC } from 'react';
import { Link } from '../../components';
import { LinkButton } from '../../bootstrap';

export const LinkButtonStory: FC = () => {
  return (
    <div>
      <h1>LinkButton examples</h1>
      <div className="mb-3">
        <Link href="/#">Regular link</Link>
      </div>
      <div className="mb-3">
        <Link href="/#" target="_blank">
          Link with target blank
        </Link>
      </div>
      <div className="mb-3">
        <LinkButton variant="dark" href="/#">
          Regular link button
        </LinkButton>
      </div>
      <div>
        <LinkButton variant="primary" href="/#" target="_blank">
          Link button with target blank
        </LinkButton>
      </div>
    </div>
  );
};

export default {
  title: 'Components/LinkButton',
  component: LinkButtonStory,
} as Meta<typeof LinkButtonStory>;
