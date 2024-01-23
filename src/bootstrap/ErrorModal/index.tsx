import Modal from 'react-bootstrap/cjs/Modal.js';
import { FC, PropsWithChildren } from 'react';
import { ErrorMessage } from '../ErrorMessage';
import { Button } from '../Button';

type ErrorModalProps = PropsWithChildren & {
  error: Error | null;
  onClose: () => void;
  title?: string;
};

export const ErrorModal: FC<ErrorModalProps> = ({
  error,
  onClose,
  title,
  children,
}) => {
  if (!error) {
    return null;
  }
  // eslint-disable-next-line no-console
  console.error(error);
  return (
    <Modal centered show onHide={onClose} animation={false}>
      <Modal.Header>
        <Modal.Title className="no-transform">
          {title || 'An Error has Occurred'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ErrorMessage error={error} className="mb-0" />
        {children}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" outlined onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
