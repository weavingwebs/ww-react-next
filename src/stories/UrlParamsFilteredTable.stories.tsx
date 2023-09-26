import { FC, useEffect, useReducer, useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { useRouter } from 'next-router-mock';
import { isEqual } from 'lodash';
import clsx from 'clsx';
import mockData from '../../mockData.json';

const makeArrayFromRange = (start: number, end: number) => {
  if (start > end) {
    throw new Error('start must be < end');
  }
  const res = [];
  for (let i = start; i <= end; i++) {
    res.push(i);
  }
  return res;
};

type QueryParamsPager = {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  updatePage: (params: { page: number }) => void;
};

type Props = QueryParamsPager & {
  className?: string;
};

const PaginationUsingQueryParams: FC<Props> = ({
  updatePage,
  totalItems,
  itemsPerPage,
  currentPage,
  className,
}) => {
  const goToPrevPage = () => updatePage({ page: currentPage - 1 });
  const goToNextPage = () => updatePage({ page: currentPage + 1 });

  const isFirstPage = currentPage <= 1;

  const totalPagesCouldBeZero = Math.ceil(totalItems / itemsPerPage);
  const totalPages = totalPagesCouldBeZero || 1;

  const allPagesArray = makeArrayFromRange(1, totalPages);

  if (allPagesArray.length === 0) {
    throw new Error('there are no pages');
  }
  // @ts-expect-error: will never happen.
  const isLastPage = currentPage >= allPagesArray.at(-1);

  return (
    <nav className={className}>
      <ul className="pagination pagination-sm">
        <li className={clsx('page-item', { disabled: isFirstPage })}>
          <button
            type="button"
            className="page-link"
            onClick={() => {
              if (isFirstPage) {
                // eslint-disable-next-line no-alert
                alert('already on first page');
                return;
              }
              goToPrevPage();
            }}
            title="Previous page"
          >
            {`<-`}
          </button>
        </li>
        <li className="page-item disabled">
          <div className="page-link text-dark font-weight-bold">
            {`${currentPage} / ${totalPages}`}
          </div>
        </li>
        <li className={clsx('page-item', { disabled: isLastPage })}>
          <button
            className="page-link"
            type="button"
            onClick={() => {
              if (isLastPage) {
                // eslint-disable-next-line no-alert
                alert('already on last page');
                return;
              }
              goToNextPage();
            }}
            disabled={isLastPage}
          >
            Next page {`->`}
          </button>
        </li>
      </ul>
    </nav>
  );
};

type Booleanish = 'true' | 'false';

// const isBooleanish = (str: unknown) => str === 'true' || str === 'false';

const booleanToBooleanish = (bool: boolean): Booleanish =>
  String(bool) as Booleanish;

// const booleanishToBoolean = (booleanish: Booleanish): boolean =>
//   booleanish === 'true';

type UrlParams<K extends string = string> = Record<
  K,
  string | number | boolean | null | undefined
>;

const constructUrlParams = (
  currentQueryParams: Record<string, string>,
  urlParams: UrlParams
): Record<string, string> => {
  // Start constructing new params object to return.
  const finalParams: Record<string, string> = {};

  // Massage our filters into a Record<string, string>.
  const newParams: Record<string, string> = {};

  Object.keys(urlParams).forEach((k) => {
    const v = urlParams[k];
    if (typeof v === 'undefined' || v === null) {
      newParams[k] = '';
      return;
    }
    if (typeof v === 'string') {
      newParams[k] = v;
      return;
    }
    if (typeof v === 'boolean') {
      newParams[k] = booleanToBooleanish(v);
      return;
    }
    // Number
    // eslint-disable-next-line no-console
    console.log('found a number, casting to', String(v));
    newParams[k] = String(v);
  });

  // Fuse old and new params into one URLSearchParams and loop over to get rid of empty values.
  new URLSearchParams({
    ...(currentQueryParams as Record<string, string>),
    ...newParams,
  }).forEach((value, key) => {
    // Skip empty values (empty strings).
    if (value) {
      finalParams[key] = value;
    }
  });

  return finalParams;
};

// NOTE: We use UrlParams because we are not setup to handle nested states (copying, merging, etc).
type Actions<T extends UrlParams> =
  | {
      filters: Partial<T>;
      type: 'set_filters';
    }
  | {
      filters: T;
      type: 'reset';
    };

function filtersReducer<T extends UrlParams>(s: T, a: Actions<T>): T {
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

const ITEMS_PER_PAGE = 5;

type MockDataItem = {
  breed: string;
  created: string;
  description: string;
  name: string;
  ownersFirstName: string;
  ownersLastName: string;
  ownersTelephone: string;
};

type MockDataQueryResult = {
  results: MockDataItem[];
  total: number;
};

const getData = async (vars: { currentPage: number; itemsPerPage: number }) => {
  // @todo: Timeout.
  const data = mockData;

  const offset = (vars.currentPage - 1) * vars.itemsPerPage;
  const page = data.slice(offset, offset + vars.itemsPerPage);

  return Promise.resolve({
    total: data.length,
    results: page,
  });
};

type Filters = UrlParams;
type LiveFilters = Filters & { page: number };

// Note: these must be listed out one by one.
const DEFAULT_FILTERS: Filters = {};
const DEFAULT_LIVE_FILTERS: LiveFilters = { ...DEFAULT_FILTERS, page: 1 };

const UrlParamsFilteredTable: FC = () => {
  const { query, isReady, replace } = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [areFiltersOpenMob, setAreFiltersOpenMob] = useState(false);
  const [paramsReady, setParamsReady] = useState(false);

  const [data, setData] = useState<MockDataQueryResult | null>(null);

  const [filtersTemp, filtersTempDispatch] = useReducer(
    filtersReducer<Filters>,
    {
      ...DEFAULT_FILTERS,
    }
  );
  const [filters, _setFiltersDispatch] = useReducer(
    filtersReducer<LiveFilters>,
    {
      ...filtersTemp,
      page: 1,
    }
  );

  const updateLiveFilters = (newFilters: LiveFilters) => {
    filtersTempDispatch({ type: 'set_filters', filters: { ...newFilters } });
    _setFiltersDispatch({ type: 'set_filters', filters: { ...newFilters } });
    const newParams = constructUrlParams(
      query as Record<string, string>,
      newFilters
    );
    replace({ query: { ...newParams } });
  };

  const resetFilters = () => {
    // Set temp filters
    filtersTempDispatch({ type: 'reset', filters: { ...DEFAULT_FILTERS } });

    // Set live filters & url.
    updateLiveFilters({ ...DEFAULT_LIVE_FILTERS });

    setAreFiltersOpenMob(false);
  };

  // This will not run when the URL changes (only on mount).
  useEffect(() => {
    if (!isReady) {
      return;
    }
    const pageFilterParam =
      (query.page as string) || DEFAULT_LIVE_FILTERS.page.toString();
    // May be NaN.
    const pageFilterParamParsed = parseInt(pageFilterParam, 10);
    const page = Number.isNaN(pageFilterParamParsed)
      ? DEFAULT_LIVE_FILTERS.page
      : pageFilterParamParsed;

    updateLiveFilters({
      page,
    });

    setParamsReady(true);
  }, [isReady]);

  useEffect(() => {
    if (!paramsReady) {
      return;
    }
    setLoading(true);

    setTimeout(() => {
      setLoading(true);
      setError(null);

      getData({ itemsPerPage: ITEMS_PER_PAGE, currentPage: filters.page })
        .then(setData)
        .catch(setError)
        .finally(() => setLoading(false));
    }, 150);
  }, [paramsReady, ITEMS_PER_PAGE, filters]);

  const hasFiltersApplied = !isEqual(filters, DEFAULT_LIVE_FILTERS);

  if (error) {
    return <div className="alert alert-danger">{error.message}</div>;
  }
  if (!isReady || loading) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <pre className="bg-light py-2">{`QueryParams: ${JSON.stringify(
        query
      )}`}</pre>

      {/* Render the filters */}
      {/* Filter panel, force open on LG+ */}
      <div
        className={clsx(
          { 'd-none': !areFiltersOpenMob },
          'd-lg-block',
          's4a-admin_filters_container'
        )}
      >
        <form
          onSubmit={(ev) => {
            ev.preventDefault();

            updateLiveFilters({
              ...filtersTemp,
              page: 1,
            });
            setAreFiltersOpenMob(false);
          }}
        >
          <div>
            <div className="row g-2 align-items-end flex-lg-nowrap">
              <div className="col-12 col-lg-auto">
                <button className="btn btn-secondary w-100" type="submit">
                  Apply Filters
                </button>
              </div>

              <div className="col-12 col-lg-auto">
                <div style={{ minWidth: 65 }}>
                  {hasFiltersApplied && (
                    <button
                      className="btn btn-outline-danger"
                      type="button"
                      onClick={resetFilters}
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Render the table */}
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Breed</th>
              <th scope="col">Description</th>
              <th scope="col">Owner</th>
              <th scope="col">Telephone</th>
              <th scope="col">Created</th>
            </tr>
          </thead>
          <tbody>
            {!data || data.total === 0 || data.results.length === 0 ? (
              <tr>
                <td colSpan={6}>No data found.</td>
              </tr>
            ) : (
              data.results.map((dog) => (
                <tr key={`${dog.name}-${dog.breed}`}>
                  <td>{dog.name}</td>
                  <td>{dog.breed}</td>
                  <td>{dog.description}</td>
                  <td>
                    {[dog.ownersFirstName, dog.ownersLastName].join(' ').trim()}
                  </td>
                  <td>{dog.ownersTelephone}</td>
                  <td>{dog.created}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Render the pager */}
      <PaginationUsingQueryParams
        totalItems={data?.total || 0}
        currentPage={filters.page}
        itemsPerPage={ITEMS_PER_PAGE}
        updatePage={({ page }) => {
          updateLiveFilters({ ...filters, page });
        }}
      />
    </div>
  );
};

const meta: Meta<typeof UrlParamsFilteredTable> = {
  title: 'UrlParamsFilteredTableStory',
  component: UrlParamsFilteredTable,
};

export default meta;

export const UrlParamsFilteredTableStory: StoryObj<
  typeof UrlParamsFilteredTable
> = {
  render: () => <UrlParamsFilteredTable />,
};
