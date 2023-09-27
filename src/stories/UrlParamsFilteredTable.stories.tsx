import { FC, useState } from 'react';
import { Meta } from '@storybook/react';
import { useRouter } from 'next-router-mock';
import clsx from 'clsx';
import { format } from 'date-fns';
import { toDate } from 'date-fns-tz';
import { ErrorMessage, FullPageLoading, FormLabel } from '../bootstrap';
import { getData, MockDataQueryResult } from './mocks';
import { makeArrayFromRange } from '../util';
import { useUrlFiltersWithPager } from '../hooks/useUrlFilters';

const parseDateTimeFromServer = (dateTimeStr: string): Date =>
  // IMPORTANT: This must use date-fns-tz to convert to local timezone.
  toDate(dateTimeStr);

const formatDateTime = (date: Date) => format(date, 'dd-MMM-yyyy HH:mm');

type QueryParamsPager = {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  updatePage: (params: { page: number }) => void;
};

type Props = QueryParamsPager & {
  className?: string;
};

// @component, needs work.
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

const ITEMS_PER_PAGE = 5;

type Filters = {
  name: string | null | undefined;
};
type LiveFilters = Filters & {
  page: number;
};

// Note: these must be listed out one by one.
const DEFAULT_FILTERS: Filters = {
  name: null,
};

const DEFAULT_LIVE_FILTERS: LiveFilters = { ...DEFAULT_FILTERS, page: 1 };

type UrlParamsFilteredTableProps = {
  throwError?: boolean;
};

export const UrlParamsFilteredTable: FC<UrlParamsFilteredTableProps> = ({
  throwError,
}) => {
  const { isReady, asPath } = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const [data, setData] = useState<MockDataQueryResult | null>(null);

  const {
    updateLiveFilters,
    updateTempFilters,
    liveFilters,
    filtersTemp,
    hasFiltersApplied,
    resetFilters,
    itemsPerPage,
  } = useUrlFiltersWithPager<Filters, Filters>({
    itemsPerPage: ITEMS_PER_PAGE,
    defaultFilters: DEFAULT_FILTERS,
    defaultLiveFilters: DEFAULT_LIVE_FILTERS,
    toQuery: (filters) => {
      return {
        name: filters.name,
      };
    },
    fromQuery: (query) => {
      return {
        name: (query.name as string) || null,
      };
    },
    onLiveFilterChange: (filters, paging): void => {
      setLoading(true);
      setError(null);

      getData({
        paging,
        where: {
          name: filters.name,
        },
      })
        .then((res) => {
          if (throwError) {
            throw new Error('A mock error has occurred');
          }
          setData(res);
        })
        .catch((err) => {
          // eslint-disable-next-line no-console
          console.error(err);
          setError(err);
          setData(null);
        })
        .finally(() => setLoading(false));
    },
  });

  if (error) {
    return (
      <ErrorMessage
        error={error}
        prefix="Unexpected error has occurred"
        reloadButton
      />
    );
  }
  if (!isReady || loading) {
    return <FullPageLoading />;
  }
  if (!data) {
    throw new Error('data is null');
  }
  return (
    // Wrap with error boundary & button to reload page.
    <div>
      <pre className="bg-light py-2">{asPath}</pre>

      {/* Render the filters */}
      <div>
        <form
          onSubmit={(ev) => {
            ev.preventDefault();
            updateLiveFilters({
              ...filtersTemp,
              page: 1, // IMPORTANT: Reset pager when changing filters.
            });
          }}
          className="mb-4"
        >
          <div className="row g-2 align-items-end flex-lg-nowrap">
            <div className="col-12 col-md-4 col-lg-3">
              <FormLabel htmlFor="name">Name</FormLabel>
              <input
                id="name"
                type="text"
                className="form-control"
                value={filtersTemp.name || ''}
                onChange={(ev) => {
                  updateTempFilters({ name: ev.target.value });
                }}
              />
            </div>
            <div className="col-12 col-md-auto">
              <button className="btn btn-secondary w-100" type="submit">
                Apply Filters
              </button>
            </div>

            <div className="col-12 col-md-auto">
              <div>
                {hasFiltersApplied && (
                  <button
                    className="btn btn-outline-danger"
                    type="button"
                    onClick={resetFilters}
                    style={{ minWidth: 115 }}
                  >
                    Clear Filters
                  </button>
                )}
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
              <th scope="col">Age</th>
              <th scope="col">Gender</th>
              <th scope="col">Company</th>
              <th scope="col">Email</th>
              <th scope="col">Telephone</th>
              <th scope="col">Registered</th>
            </tr>
          </thead>
          <tbody>
            {!data || data.total === 0 || data.results.length === 0 ? (
              <tr>
                <td colSpan={6}>No data found.</td>
              </tr>
            ) : (
              data.results.map((person) => (
                <tr key={person.id}>
                  <td>{person.name}</td>
                  <td>{person.age}</td>
                  <td>{person.gender}</td>
                  <td>{person.company}</td>
                  <td>{person.email}</td>
                  <td>{person.phone}</td>
                  <td>
                    {formatDateTime(parseDateTimeFromServer(person.registered))}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Render the pager */}
      <PaginationUsingQueryParams
        totalItems={data?.total || 0}
        currentPage={liveFilters.page}
        itemsPerPage={itemsPerPage}
        updatePage={({ page }) => {
          updateLiveFilters({ page });
        }}
        className="mt-3 d-flex justify-content-center"
      />
    </div>
  );
};

const meta: Meta<typeof UrlParamsFilteredTable> = {
  title: 'Url Params Filtered Table',
  component: UrlParamsFilteredTable,
  parameters: {
    docs: {
      source: {
        type: 'code',
      },
    },
  },
};

export default meta;
