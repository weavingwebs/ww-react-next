import { useCallback, useReducer } from 'react';

export type ModalReducerState = {
  isOpen: boolean;
};

export type ModalReducerOpenAction = {
  type: 'open';
};

export type ModalReducerCloseAction = {
  type: 'close';
};

export type ModalReducerAction =
  | ModalReducerOpenAction
  | ModalReducerCloseAction;

export const modalReducer = (
  s: ModalReducerState,
  a: ModalReducerAction
): ModalReducerState => {
  switch (a.type) {
    case 'open': {
      return {
        ...s,
        isOpen: true,
      };
    }
    case 'close': {
      return {
        ...s,
        isOpen: false,
      };
    }
    default: {
      // @ts-expect-error belt and braces.
      throw new Error(`invalid action '${a.type}'`);
    }
  }
};

export const useModal = () => {
  const [state, dispatch] = useReducer(modalReducer, { isOpen: false });

  const onOpen = useCallback((): void => dispatch({ type: 'open' }), []);
  const onClose = useCallback((): void => dispatch({ type: 'close' }), []);

  return {
    ...state,
    onOpen,
    onClose,
  };
};
