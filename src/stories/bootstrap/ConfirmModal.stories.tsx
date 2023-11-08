import BootstrapModal from 'react-bootstrap/Modal';
import { FC } from 'react';
import { Meta } from '@storybook/react';
import { Button } from '../../bootstrap/Button';
import { useConfirmModal } from '../../hooks/useConfirmModal';
import { ErrorMessage, Loading } from '../../bootstrap';

export const ConfirmModal: FC = () => {
  const {
    isOpen,
    onCancel,
    titleLine,
    confirmLine,
    showConfirm,
    confirmBtnLabel,
    isConfirming,
    error,
    onConfirm,
  } = useConfirmModal();

  return (
    <div>
      <div className="mb-3">
        <Button
          variant="primary"
          onClick={() =>
            showConfirm({
              onConfirm: async () => {
                await new Promise((resolve) => {
                  setTimeout(() => {
                    // eslint-disable-next-line no-alert
                    alert('Confirmed successfully');
                    resolve(null);
                  }, 500);
                });
              },
            })
          }
        >
          Open modal (successful confirm)
        </Button>
      </div>
      <div>
        <Button
          variant="primary"
          onClick={() =>
            showConfirm({
              onConfirm: async () => {
                await new Promise((resolve, reject) => {
                  setTimeout(() => {
                    reject(new Error('I failed'));
                  }, 500);
                });
              },
            })
          }
        >
          Open modal (failed confirm)
        </Button>
      </div>

      <BootstrapModal
        centered
        show={isOpen}
        onHide={onCancel}
        animation={false}
        scrollable={false}
        // Don't allow dismissing while confirming.
        backdrop={isConfirming ? 'static' : undefined}
      >
        <BootstrapModal.Header closeButton={!isConfirming}>
          <BootstrapModal.Title>{titleLine}</BootstrapModal.Title>
        </BootstrapModal.Header>
        <BootstrapModal.Body>
          {confirmLine}

          <ErrorMessage error={error} className="mt-3" />

          <div className="d-flex justify-content-end">
            <Button variant="danger" outlined onClick={onCancel}>
              Close
            </Button>
            <Button
              variant="primary"
              onClick={onConfirm}
              disabled={isConfirming}
              className="ms-2"
            >
              {isConfirming ? (
                <Loading size="sm" colour="light" />
              ) : (
                confirmBtnLabel
              )}
            </Button>
          </div>
        </BootstrapModal.Body>
      </BootstrapModal>
    </div>
  );
};

const meta: Meta = {
  title: 'Bootstrap/Modal',
  component: ConfirmModal,
};

export default meta;
