import * as React from 'react';
import { useMemo } from 'react';

export interface PagerState {
  currentPage: number;
  isLastPage: boolean;
  itemsPerPage: number;
  total: number;
}

interface PrevAction {
  type: 'prev';
}

interface NextAction {
  type: 'next';
}

interface ResetAction {
  type: 'reset';
}

interface UpdateTotalAction {
  total: number;
  type: 'update';
}

interface UpdateCurrentPage {
  page: number;
  type: 'updateCurrentPage';
}

interface UpdateItemsPerPage {
  itemsPerPage: number;
  type: 'updateItemsPerPage';
}

export type PagerActions =
  | PrevAction
  | NextAction
  | UpdateTotalAction
  | ResetAction
  | UpdateCurrentPage
  | UpdateItemsPerPage;

const pagerReducer = (state: PagerState, action: PagerActions): PagerState => {
  const newState = { ...state };

  switch (action.type) {
    case 'prev':
      newState.currentPage = state.currentPage - 1;
      break;

    case 'next':
      newState.currentPage = state.currentPage + 1;
      break;

    case 'update':
      newState.total = action.total;
      break;

    case 'reset':
      newState.currentPage = 1;
      break;

    case 'updateCurrentPage':
      newState.currentPage = action.page;
      break;

    case 'updateItemsPerPage':
      newState.itemsPerPage = action.itemsPerPage;
      newState.currentPage = 1;
      break;

    default: {
      throw new Error('unhandled case');
    }
  }

  newState.isLastPage =
    newState.currentPage * newState.itemsPerPage >= newState.total;
  return newState;
};

export const usePager = (
  itemsPerPageDefault: number,
  initialTotal: number = 0
) => {
  const [state, dispatch] = React.useReducer(pagerReducer, {
    itemsPerPage: itemsPerPageDefault,
    total: initialTotal,
    currentPage: 1,
    isLastPage: false,
  });
  const { total, currentPage, isLastPage, itemsPerPage } = state;

  const paging = useMemo(() => {
    return {
      limit: itemsPerPage,
      offset: (currentPage - 1) * itemsPerPage,
    };
  }, [currentPage, itemsPerPage]);

  const totalPages = useMemo(() => {
    return Math.ceil(total / itemsPerPage);
  }, [total, itemsPerPage]);

  return {
    total,
    totalPages,
    currentPage,
    isLastPage,
    itemsPerPage,
    dispatch,
    paging,
  };
};
