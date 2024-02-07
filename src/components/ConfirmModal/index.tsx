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
  cancelBtnLabel,
  confirmButtonStyle,
  isPositiveAction,
  isOpen,
  onCancel,
  dontAutoCloseOnSuccess,
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
      animation={false}
    >
      <BootstrapModal.Header closeButton={!isConfirming}>
        <BootstrapModal.Title>
          {titleLine || 'Are you sure?'}
        </BootstrapModal.Title>
      </BootstrapModal.Header>
      <BootstrapModal.Body>
        {confirmLine && <div className="mb-3">{confirmLine}</div>}

        <ErrorMessage error={error} />

        <div className="d-flex justify-content-end">
          {!isConfirming && (
            <Button variant="danger" outlined onClick={onCancel}>
              {cancelBtnLabel || 'Cancel'}
            </Button>
          )}
          <Button
            variant={isPositiveAction ? 'success' : 'danger'}
            onClick={(ev) => {
              ev.preventDefault();
              runAsync(onConfirm).then((res) => {
                // Close if promise didn't error and we didn't opt out of auto closing via prop.
                if (!res.error && !dontAutoCloseOnSuccess) {
                  onCancel();
                }
              });
            }}
            disabled={isConfirming}
            className="ms-2"
            style={{ minWidth: '85px', ...confirmButtonStyle }}
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
