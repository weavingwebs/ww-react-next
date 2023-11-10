import BootstrapModal from 'react-bootstrap/cjs/Modal.js';
import { FC } from 'react';
import { Meta } from '@storybook/react';
import { Button } from '../../bootstrap/Button';
import { useModal } from '../../hooks/useModal';

export const Modal: FC = () => {
  const { isOpen, onClose, onOpen } = useModal();
  return (
    <div>
      <Button variant="primary" onClick={onOpen}>
        Open modal
      </Button>
      <BootstrapModal show={isOpen} onHide={onClose} centered animation={false}>
        <BootstrapModal.Header closeButton>
          <BootstrapModal.Title>Title</BootstrapModal.Title>
        </BootstrapModal.Header>
        <BootstrapModal.Body>
          Lorem ipsum dolor sit amet.
          <div className="d-flex justify-content-end">
            <Button variant="danger" outlined onClick={onClose}>
              Close
            </Button>
          </div>
        </BootstrapModal.Body>
      </BootstrapModal>
    </div>
  );
};

const meta: Meta = {
  title: 'Bootstrap/Modal',
  component: Modal,
  args: {
    isLoading: false,
    showError: false,
  },
};

export default meta;
