import { NextRouter } from 'next/router.js';
import { useCallback, useEffect, useMemo, useReducer, useState } from 'react';
import isEqual from 'lodash/isEqual';
import { ParsedUrlQueryInput } from 'node:querystring';
import { booleanToBooleanish } from '../util';

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
  // defaultFilters are the initial form values (if no url params)
  defaultFilters: F;
  // defaultLiveFilters are the initial url/live filters used to query the data
  // (if no url params). They should usually extend defaultFilters (i.e. with
  // extras such as page).
  defaultLiveFilters: L;
  // fromQuery is only used if there are query params, otherwise
  // defaultLiveFilters will be used directly.
  // fromQuery is responsible for merging defaults itself.
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
  const { query, isReady } = router;

  const [filtersReady, setFiltersReady] = useState(false);

  const [filtersTemp, filtersTempDispatch] = useReducer(filtersReducer<F>, {
    ...defaultFilters,
  });
  const [filters, _setFiltersDispatch] = useReducer(filtersReducer<L>, {
    ...defaultLiveFilters,
  });

  const replace = useCallback(
    (newFilters: Partial<L>) => {
      // Remove null or undefined from the url.
      const newQuery: UrlParams = {};
      Object.entries(toQuery({ ...filters, ...newFilters })).forEach(
        ([k, v]) => {
          // Filter out empties.
          if (typeof v === 'undefined' || v === null || v === '') {
            return;
          }
          // Convert any boolean to 'true' or 'false'.
          if (typeof v === 'boolean') {
            newQuery[k] = booleanToBooleanish(v);
          } else {
            newQuery[k] = v;
          }
        }
      );
      return router.replace({
        // Include current pathname so allow this to work on dynamic routes.
        // https://nextjs.org/docs/messages/href-interpolation-failed
        pathname: window.location.pathname,
        query: newQuery,
      });
    },
    [router]
  );

  const updateLiveFilters = (newFilters: Partial<L>) => {
    filtersTempDispatch({ type: 'set_filters', filters: { ...newFilters } });
    _setFiltersDispatch({ type: 'set_filters', filters: { ...newFilters } });

    return replace(newFilters);
  };

  const resetFilters = () => {
    // Set temp filters
    filtersTempDispatch({ type: 'reset', filters: { ...defaultFilters } });

    // Set live filters & url.
    return updateLiveFilters({ ...defaultLiveFilters });
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
    // @todo Figure out why the nextjs router.replace fails unless we delay it
    //   until after this initial 'isReady' render.
    const timeout = setTimeout(() => {
      if (Object.keys(query).length) {
        updateLiveFilters(fromQuery(query)).then(() => setFiltersReady(true));
      } else {
        replace(defaultLiveFilters).then(() => setFiltersReady(true));
      }
    }, 0);
    // eslint-disable-next-line consistent-return
    return () => clearTimeout(timeout);
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
