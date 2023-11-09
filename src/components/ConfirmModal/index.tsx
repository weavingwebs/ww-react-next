import { CSSProperties, FC, PropsWithChildren } from 'react';
import BootstrapModal from 'react-bootstrap/Modal';
import { Button, ErrorMessage, Loading } from '../../bootstrap';
import { useConfirmModal } from '../../hooks';

// @todo: fix this crazy type.
type ConfirmModalProps = Omit<
  ReturnType<typeof useConfirmModal>,
  'showConfirm'
> & {
  // @todo: Include those in reducer.
  // That way we can have one confirm modal component
  // for multiple confirms
  cancelText?: string;
  confirmButtonStyle?: CSSProperties;
  isPositiveAction?: boolean;
  size?: 'lg' | 'sm' | 'xl';
};

export const ConfirmModal: FC<PropsWithChildren<ConfirmModalProps>> = ({
  titleLine,
  confirmLine,
  error,
  confirmBtnLabel,
  onConfirm,
  onCancel,
  isConfirming,
  isOpen,
  size,
  cancelText,
  confirmButtonStyle,
  isPositiveAction,
}) => {
  return (
    <BootstrapModal
      centered
      show={isOpen}
      onHide={onCancel}
      animation={false}
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
            onClick={onConfirm}
            disabled={isConfirming}
            className="ms-2"
            style={confirmButtonStyle}
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
  );
};
