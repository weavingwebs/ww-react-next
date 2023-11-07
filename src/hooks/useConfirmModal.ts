import { ReactNode, useReducer } from 'react';
import { useModal } from './useModal';

type State = {
  confirmBtnLabel?: ReactNode;
  confirmLine?: ReactNode;
  error: Error | null;
  isConfirming: boolean;
  onConfirm: () => Promise<void>;
  titleLine?: string;
};

type SetAction = {
  state: State;
  type: 'set';
};

type StartConfirmingAction = {
  type: 'start_confirming';
};

type StopConfirmingAction = {
  type: 'stop_confirming';
};

type ShowErrorAction = {
  error: Error;
  type: 'show_error';
};

type Action =
  | SetAction
  | StartConfirmingAction
  | StopConfirmingAction
  | ShowErrorAction;

const confirmModalReducer = (s: State, a: Action): State => {
  switch (a.type) {
    case 'set': {
      return { ...a.state };
    }
    case 'start_confirming': {
      return { ...s, isConfirming: true, error: null };
    }
    case 'stop_confirming': {
      return { ...s, isConfirming: false };
    }
    case 'show_error': {
      return { ...s, isConfirming: false, error: a.error };
    }
    default: {
      // eslint-disable-next-line no-console
      console.error({ a });
      throw new Error(`unhandled case`);
    }
  }
};

const DEFAULT: State = {
  isConfirming: false,
  error: null,
  titleLine: 'Are you sure?',
  confirmBtnLabel: 'Confirm',
  confirmLine: 'Please confirm this action.',
  onConfirm: async () => {
    throw new Error('onConfirm is not set');
  },
};

export const useConfirmModal = () => {
  const { isOpen, openModal, closeModal } = useModal();
  const [state, dispatch] = useReducer(confirmModalReducer, DEFAULT);

  const showConfirm = (newState: Omit<State, 'isConfirming' | 'error'>) => {
    // incorporate into reducer.
    openModal();

    dispatch({
      type: 'set',
      state: {
        isConfirming: DEFAULT.isConfirming,
        error: DEFAULT.error,
        titleLine: newState.titleLine || DEFAULT.titleLine,
        confirmBtnLabel: newState.confirmBtnLabel || DEFAULT.confirmBtnLabel,
        confirmLine: newState.confirmLine || DEFAULT.confirmLine,
        onConfirm: newState.onConfirm,
      },
    });
  };

  const onCancel = () => {
    // reset all state?
    closeModal();
  };

  // remove onConfirm from state as we'll be wrapping it.
  const { onConfirm: _onConfirm, ...confirmModalState } = state;

  const onConfirm = async () => {
    dispatch({ type: 'start_confirming' });
    _onConfirm()
      .then(() => {
        dispatch({ type: 'stop_confirming' });
        onCancel();
      })
      .catch((error) => {
        dispatch({ type: 'show_error', error });
      });
  };

  return {
    ...confirmModalState,
    showConfirm,
    onConfirm,
    onCancel,
    isOpen,
  };
};
