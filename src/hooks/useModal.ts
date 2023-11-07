import { useCallback, useMemo, useState } from 'react';

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
