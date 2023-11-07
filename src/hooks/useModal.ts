import { useCallback, useMemo, useState } from 'react';

// @todo: I think we rename the states to show, onHide to be compatible with react boostrap modal props.
export const useModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const openModal = useCallback((): void => setIsOpen(true), []);
  const closeModal = useCallback((): void => setIsOpen(false), []);

  return useMemo(
    () => ({
      isOpen,
      openModal,
      closeModal,
    }),
    [isOpen, openModal, closeModal]
  );
};
