import { FC, useEffect, useState } from 'react';
import { Meta } from '@storybook/react';
import { useRouter } from 'next-router-mock';
import { format } from 'date-fns';
import { toDate } from 'date-fns-tz';
import { MemoryRouterProvider } from 'next-router-mock/MemoryRouterProvider/next-13.5';
import {
  BsFormLabel,
  FullPageLoading,
  Pagination,
  TableResultsWithPlaceholder,
} from '../../bootstrap';
import { getData, MockDataQueryResult } from '../mocks';
import { useUrlFiltersWithPage } from '../../hooks';

const parseDateTimeFromServer = (dateTimeStr: string): Date =>
  // IMPORTANT: This must use date-fns-tz to convert to local timezone.
  toDate(dateTimeStr);

const formatDateTime = (date: Date) => format(date, 'dd-MMM-yyyy HH:mm');

const ITEMS_PER_PAGE = 5;

type Filters = {
  name: string | null | undefined;
};
type LiveFilters = Filters & {
  page: number;
};

// Note: these must be listed out one by one.
const DEFAULT_FILTERS: Filters = {
  name: 'test',
};

const DEFAULT_LIVE_FILTERS: LiveFilters = { ...DEFAULT_FILTERS, page: 1 };

type UrlParamsFilteredTableProps = {
  throwError?: boolean;
};

export const FullExampleWithPaging: FC<UrlParamsFilteredTableProps> = ({
  throwError,
}) => {
  const router = useRouter();
  const { isReady, asPath } = router;
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const [data, setData] = useState<MockDataQueryResult | null>(null);

  const {
    filtersReady,
    paging,
    updateLiveFilters,
    updateTempFilters,
    liveFilters,
    filtersTemp,
    hasFiltersApplied,
    resetFilters,
    itemsPerPage,
  } = useUrlFiltersWithPage<Filters, Filters>({
    router,
    itemsPerPage: ITEMS_PER_PAGE,
    defaultFilters: DEFAULT_FILTERS,
    defaultLiveFilters: DEFAULT_LIVE_FILTERS,
    toQuery: (filters) => {
      return {
        name: filters.name,
      };
    },
    fromQuery: (query) => {
      const nameFilter = (query.name as string) || null;

      // If a url param is not present, we need to default it ourselves.
      return {
        name: nameFilter || DEFAULT_LIVE_FILTERS.name,
      };
    },
  });

  // Run the query when the filters change.
  useEffect(() => {
    // Important: Only run the query when the filters are ready, if we run too
    // early then the url params will not have been parsed yet.
    if (!filtersReady) {
      return;
    }

    setIsLoading(true);
    setError(null);

    getData({
      paging,
      where: {
        name: liveFilters.name,
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
      .finally(() => setIsLoading(false));
  }, [filtersReady, liveFilters, paging, throwError]);

  if (!isReady || !filtersReady) {
    return <FullPageLoading />;
  }
  return (
    <div>
      {/* Render the current URL for demo purposes */}
      <pre className="bg-light py-2">{asPath}</pre>

      {/* Filters */}
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
              <BsFormLabel htmlFor="name">Name</BsFormLabel>
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

      {/* Results */}
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
            <TableResultsWithPlaceholder
              columnCount={7}
              error={error}
              errorPrefix="Failed to get results"
              placeholderRowCount={itemsPerPage}
              isLoading={isLoading}
              results={data?.results}
              renderRow={(person) => (
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
              )}
            />
          </tbody>
        </table>
      </div>

      <Pagination
        totalItems={data?.total || 0}
        currentPage={liveFilters.page}
        itemsPerPage={itemsPerPage}
        onChange={(page) => {
          updateLiveFilters({ page });
        }}
        className="mt-3 d-flex justify-content-center"
      />
    </div>
  );
};

const meta: Meta<typeof FullExampleWithPaging> = {
  title: 'Hooks/useUrlFilters',
  component: FullExampleWithPaging,
  decorators: [
    // Make next/link work.
    (Story) => (
      <MemoryRouterProvider>
        <Story />
      </MemoryRouterProvider>
    ),
  ],
};

export default meta;
