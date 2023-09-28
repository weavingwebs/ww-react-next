import { FC, useState } from 'react';
import { Meta } from '@storybook/react';
import { useRouter } from 'next-router-mock';
import { format } from 'date-fns';
import { toDate } from 'date-fns-tz';
import { MemoryRouterProvider } from 'next-router-mock/MemoryRouterProvider/next-13.5';
import {
  ErrorMessage,
  FormLabel,
  FullPageLoading,
  Pagination,
} from '../bootstrap';
import { getData, MockDataQueryResult } from './mocks';
import { useUrlFiltersWithPager } from '../hooks';

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
  name: null,
};

const DEFAULT_LIVE_FILTERS: LiveFilters = { ...DEFAULT_FILTERS, page: 1 };

type UrlParamsFilteredTableProps = {
  throwError?: boolean;
};

export const UrlParamsFilteredTable: FC<UrlParamsFilteredTableProps> = ({
  throwError,
}) => {
  const router = useRouter();
  const { isReady, asPath } = router;
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

const meta: Meta<typeof UrlParamsFilteredTable> = {
  title: 'useUrlFilters',
  component: UrlParamsFilteredTable,
  tags: ['autodocs'],
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
