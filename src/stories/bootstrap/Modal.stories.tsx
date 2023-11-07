import BootstrapModal from 'react-bootstrap/Modal';
import { FC } from 'react';
import { Meta } from '@storybook/react';
import { Button } from '../../bootstrap/Button';
import { useModal } from '../../hooks/useModal';

export const Modal: FC = () => {
  const { isOpen, openModal, closeModal } = useModal();
  return (
    <div>
      <Button variant="primary" onClick={openModal}>
        Open modal
      </Button>
      <BootstrapModal show={isOpen} onHide={closeModal} centered>
        <BootstrapModal.Header closeButton>
          <BootstrapModal.Title>Title</BootstrapModal.Title>
        </BootstrapModal.Header>
        <BootstrapModal.Body>
          Lorem ipsum dolor sit amet.
          <div className="d-flex justify-content-end">
            <Button variant="danger" outlined onClick={closeModal}>
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
