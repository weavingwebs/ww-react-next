import { useCallback, useMemo, useReducer, useState } from 'react';

// @todo: I think non-memoized should be the first point of call.
// Only use the memoized version when performance issues arise.

// Non-memoized.
export const useModalOld = () => {
  const [isOpen, setIsOpen] = useState(false);
  const openModal = (): void => setIsOpen(true);
  const closeModal = (): void => setIsOpen(false);

  return { isOpen, openModal, closeModal };
};

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

type State = {
  show: boolean;
  // @todo: we can add more stuff here
  // e.g. animation: boolean
};

type OpenAction = {
  type: 'open';
};

type CloseAction = {
  type: 'close';
};

type Action = OpenAction | CloseAction;

const modalReducer = (s: State, a: Action): State => {
  switch (a.type) {
    case 'open': {
      return {
        ...s,
        show: true,
      };
    }
    case 'close': {
      return {
        ...s,
        show: false,
      };
    }
    default: {
      throw new Error('unhandled case');
    }
  }
};

export const useModalNew = () => {
  const [state, dispatch] = useReducer(modalReducer, { show: false });

  const onOpen = useCallback((): void => dispatch({ type: 'open' }), []);
  const onHide = useCallback((): void => dispatch({ type: 'close' }), []);

  const { show } = state;

  return useMemo(
    () => ({
      show,
      onOpen,
      onHide,
    }),
    [show, onOpen, onHide]
  );
};
