import { useCallback, useReducer } from 'react';

type LoadingReducerState<T> = {
  error: Error | null;
  isLoading: boolean;
  result: T | null;
};

type StartLoadingAction = {
  type: 'start_loading';
};
type OnErrorAction = {
  error: Error;
  type: 'on_error';
};
type SetErrorAction = {
  error: Error | null;
  type: 'set_error';
};
type SuccessAction<T> = {
  result: T | null;
  type: 'success';
};
type ResetAction = {
  type: 'reset';
};
type LoadingReducerAction<T> =
  | StartLoadingAction
  | OnErrorAction
  | SetErrorAction
  | SuccessAction<T>
  | ResetAction;

function loadingReducer<T>(
  s: LoadingReducerState<T>,
  a: LoadingReducerAction<T>
): LoadingReducerState<T> {
  switch (a.type) {
    case 'start_loading': {
      return {
        ...s,
        isLoading: true,
        error: null,
      };
    }
    case 'on_error': {
      return {
        ...s,
        result: null,
        isLoading: false,
        error: a.error,
      };
    }
    case 'set_error': {
      return {
        ...s,
        error: a.error,
      };
    }
    case 'success': {
      return {
        ...s,
        isLoading: false,
        result: a.result,
      };
    }
    case 'reset': {
      return {
        error: null,
        isLoading: false,
        result: null,
      };
    }
    default: {
      // @ts-expect-error: belt & braces.
      throw new Error(`unhandled case: ${a.type}`);
    }
  }
}

export function useAsync<T>(
  defaultState: Omit<LoadingReducerState<T>, 'error'>
) {
  const [state, dispatch] = useReducer(loadingReducer<T>, {
    ...defaultState,
    error: null,
  });

  const runAsync = useCallback((fn: () => Promise<T | null>) => {
    dispatch({ type: 'start_loading' });
    return fn()
      .then((result) => {
        dispatch({ type: 'success', result });
        return { result, error: null };
      })
      .catch((error) => {
        dispatch({
          type: 'on_error',
          error,
        });
        return { result: null, error };
      });
  }, []);

  const resetAsync = useCallback(() => {
    dispatch({ type: 'reset' });
  }, []);

  return {
    ...state,
    runAsync,
    resetAsync,
  };
}
