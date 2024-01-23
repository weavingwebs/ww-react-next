import { Meta } from '@storybook/react';
import { FC } from 'react';
import { FaCopy } from 'react-icons/fa6';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { useCopyToClipboard } from '../../hooks';

const TEXT_TO_COPY = 'This is some text to copy';

export const UseCopyToClipboardStory: FC = () => {
  const { hasCopiedToClipboard, copyToClipboard, resetCopiedStatus } =
    useCopyToClipboard();

  return (
    <div>
      <OverlayTrigger
        show={hasCopiedToClipboard}
        onToggle={resetCopiedStatus}
        placement="right"
        overlay={<Tooltip id="tooltip-copied">Copied!</Tooltip>}
      >
        {/* @todo: This doesn't work with a <Button> component, might be due to it not accepting ref. */}
        <button
          type="button"
          className="btn btn-primary"
          title="Copy to clipboard"
          onClick={() => copyToClipboard(TEXT_TO_COPY)}
        >
          {TEXT_TO_COPY} <FaCopy className="ms-2" size={14} />
        </button>
      </OverlayTrigger>
    </div>
  );
};

const meta: Meta = {
  title: 'Hooks/useCopyToClipboard',
  component: UseCopyToClipboardStory,
};

export default meta;
