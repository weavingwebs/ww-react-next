import { useModal } from '../hooks';

export function bootstrapModalProps(props: ReturnType<typeof useModal>) {
  return {
    show: props.isOpen,
    onHide: props.onClose,
  };
}
