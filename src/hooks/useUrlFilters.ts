import { NextRouter } from 'next/router';
import { useEffect, useMemo, useReducer, useState } from 'react';
import isEqual from 'lodash/isEqual';
import { ParsedUrlQueryInput } from 'node:querystring';

type PagingInput = {
  limit: number;
  offset?: number | null;
};

type UrlParams = ParsedUrlQueryInput;

// NOTE: We use UrlParams because we are not setup to handle nested states (copying, merging, etc).
type Actions<F extends {}> =
  | {
      filters: Partial<F>;
      type: 'set_filters';
    }
  | {
      filters: F;
      type: 'reset';
    };

function filtersReducer<F extends {}>(s: F, a: Actions<F>): F {
  const newState = { ...s };
  switch (a.type) {
    case 'set_filters': {
      return {
        ...newState,
        ...a.filters,
      };
    }
    case 'reset': {
      return { ...a.filters };
    }
    default: {
      // eslint-disable-next-line no-console
      console.error(a);
      throw new Error('unhandled case');
    }
  }
}

type UseUrlFiltersInput<F extends {}, L extends F> = {
  defaultFilters: F;
  defaultLiveFilters: L;
  fromQuery: (params: UrlParams) => L;
  router: NextRouter;
  toQuery: (filters: L) => UrlParams;
};

export function useUrlFilters<F extends {}, L extends F>({
  defaultFilters,
  defaultLiveFilters,
  fromQuery,
  toQuery,
  router,
}: UseUrlFiltersInput<F, L>) {
  const { query, isReady, replace } = router;
  const [filtersReady, setFiltersReady] = useState(false);

  const [filtersTemp, filtersTempDispatch] = useReducer(filtersReducer<F>, {
    ...defaultFilters,
  });
  const [filters, _setFiltersDispatch] = useReducer(filtersReducer<L>, {
    ...defaultLiveFilters,
  });

  const updateLiveFilters = (newFilters: Partial<L>) => {
    filtersTempDispatch({ type: 'set_filters', filters: { ...newFilters } });
    _setFiltersDispatch({ type: 'set_filters', filters: { ...newFilters } });

    // Remove null or undefined from the url.
    const newQuery: UrlParams = {};
    Object.entries(toQuery({ ...filters, ...newFilters })).forEach(([k, v]) => {
      if (v) {
        newQuery[k] = v;
      }
    });
    void replace({ query: newQuery });
  };

  const resetFilters = () => {
    // Set temp filters
    filtersTempDispatch({ type: 'reset', filters: { ...defaultFilters } });

    // Set live filters & url.
    updateLiveFilters({ ...defaultLiveFilters });
  };

  const updateTempFilters = (newFilters: Partial<F>) =>
    filtersTempDispatch({
      type: 'set_filters',
      filters: newFilters,
    });

  // This will not run when the URL changes (only on mount).
  useEffect(() => {
    if (!isReady) {
      return;
    }
    updateLiveFilters(fromQuery(query));
    setFiltersReady(true);
  }, [isReady]);

  const hasFiltersApplied = useMemo(
    () => !isEqual(filters, defaultLiveFilters),
    [filters, defaultLiveFilters]
  );

  return {
    filtersReady,
    hasFiltersApplied,
    resetFilters,
    filtersTemp,
    liveFilters: filters,
    updateLiveFilters,
    updateTempFilters,
  };
}

type FiltersWithPage<F extends {}> = F & { page: number };

type UseUrlFiltersWithPageInput<F extends {}, L extends F> = UseUrlFiltersInput<
  F,
  L
> & {
  itemsPerPage: number;
};

export function useUrlFiltersWithPage<F extends {}, L extends F>({
  itemsPerPage,
  fromQuery,
  toQuery,
  ...input
}: UseUrlFiltersWithPageInput<F, L>) {
  const defaultLiveFilters = {
    page: 1,
    ...input.defaultLiveFilters,
  };

  const res = useUrlFilters<F, FiltersWithPage<L>>({
    ...input,
    defaultLiveFilters,
    fromQuery: (query) => {
      const pageFilterParam =
        (query.page as string) || defaultLiveFilters.page.toString();

      // May be NaN.
      const pageFilterParamParsed = parseInt(pageFilterParam, 10);
      const page = Number.isNaN(pageFilterParamParsed)
        ? defaultLiveFilters.page
        : pageFilterParamParsed;

      return {
        page,
        ...fromQuery(query),
      };
    },
    toQuery: (filters) => ({
      ...toQuery(filters),
      page: String(filters.page),
    }),
  });

  const paging = useMemo<PagingInput>(() => {
    return {
      limit: itemsPerPage,
      offset: (res.liveFilters.page - 1) * itemsPerPage,
    };
  }, [res.liveFilters.page, itemsPerPage]);

  return {
    ...res,
    itemsPerPage,
    paging,
  };
}
