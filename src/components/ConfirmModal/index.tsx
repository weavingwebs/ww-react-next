import { FC, useEffect } from 'react';
import BootstrapModal from 'react-bootstrap/cjs/Modal.js';
import { Button, ErrorMessage, Loading } from '../../bootstrap';
import { useAsync, useConfirmModal } from '../../hooks';

type ConfirmModalProps = ReturnType<typeof useConfirmModal>;

export const ConfirmModal: FC<ConfirmModalProps> = ({
  titleLine,
  confirmLine,
  confirmBtnLabel,
  onConfirm,
  size,
  cancelText,
  confirmButtonStyle,
  isPositiveAction,
  isOpen,
  onCancel,
}) => {
  const {
    isLoading: isConfirming,
    error,
    runAsync,
    resetAsync,
  } = useAsync<void>({
    isLoading: false,
    result: null,
  });

  // Reset error on close.
  useEffect(() => {
    if (!isOpen) {
      resetAsync();
    }
  }, [isOpen]);

  return (
    <BootstrapModal
      show={isOpen}
      onHide={onCancel}
      centered
      scrollable={false}
      // Don't allow dismissing while confirming.
      backdrop={isConfirming ? 'static' : undefined}
      size={size}
    >
      <BootstrapModal.Header closeButton={!isConfirming}>
        <BootstrapModal.Title>{titleLine}</BootstrapModal.Title>
      </BootstrapModal.Header>
      <BootstrapModal.Body>
        {confirmLine}

        <ErrorMessage error={error} className="mt-3" />

        <div className="d-flex justify-content-end">
          <Button variant="danger" outlined onClick={onCancel}>
            {cancelText || 'Cancel'}
          </Button>
          <Button
            variant={isPositiveAction ? 'success' : 'danger'}
            onClick={(ev) => {
              ev.preventDefault();
              runAsync(onConfirm);
            }}
            disabled={isConfirming}
            className="ms-2"
            style={confirmButtonStyle}
          >
            {isConfirming ? (
              <Loading size="sm" colour="light" />
            ) : (
              confirmBtnLabel || 'Confirm'
            )}
          </Button>
        </div>
      </BootstrapModal.Body>
    </BootstrapModal>
  );
};
