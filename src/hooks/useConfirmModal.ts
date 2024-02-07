import { CSSProperties, ReactNode, useCallback, useReducer } from 'react';
import { ModalReducerCloseAction, ModalReducerState } from './useModal';

export type ConfirmModalConfig = {
  cancelBtnLabel?: string;
  confirmBtnLabel?: ReactNode;
  confirmButtonStyle?: CSSProperties;
  confirmLine?: ReactNode;
  dontAutoCloseOnSuccess?: boolean;
  isPositiveAction?: boolean;
  onConfirm: () => Promise<void>;
  size?: 'lg' | 'sm' | 'xl';
  titleLine?: string;
};

export type ConfirmModalState = ModalReducerState & {
  config: ConfirmModalConfig;
};

const DEFAULT: ConfirmModalState = {
  isOpen: false,
  config: {
    onConfirm: async () => {
      throw new Error('onConfirm is not set');
    },
  },
};

type OpenAction = {
  config: ConfirmModalConfig;
  type: 'open';
};

type Action = OpenAction | ModalReducerCloseAction;

const confirmModalReducer = (
  s: ConfirmModalState,
  a: Action
): ConfirmModalState => {
  switch (a.type) {
    case 'open': {
      return { config: a.config, isOpen: true };
    }
    case 'close': {
      return { ...DEFAULT };
    }
    default: {
      // @ts-expect-error belt and braces.
      throw new Error(`invalid action '${a.type}'`);
    }
  }
};

export const useConfirmModal = () => {
  const [state, dispatch] = useReducer(confirmModalReducer, DEFAULT);

  const showConfirm = useCallback(
    (config: ConfirmModalConfig) => {
      dispatch({
        type: 'open',
        config,
      });
    },
    [dispatch]
  );

  const onCancel = useCallback(() => {
    dispatch({ type: 'close' });
  }, [dispatch]);

  return {
    ...state.config,
    isOpen: state.isOpen,
    showConfirm,
    onCancel,
  };
};
