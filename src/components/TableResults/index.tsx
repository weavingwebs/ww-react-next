import { ReactNode } from 'react';
import { ErrorMessage, FullPageLoading } from '../../bootstrap';

export type TableResultsProps<T> = {
  columnCount: number;
  error: Error | null;
  errorPrefix: string;
  isLoading: boolean;
  renderRow: (row: T) => ReactNode;
  results: T[] | null | undefined;
};

export function TableResults<T extends {}>({
  isLoading,
  error,
  errorPrefix,
  results,
  columnCount,
  renderRow,
}: TableResultsProps<T>) {
  if (error) {
    return (
      <tr>
        <td colSpan={columnCount}>
          <ErrorMessage error={error} prefix={errorPrefix} />
        </td>
      </tr>
    );
  }

  if (isLoading) {
    return (
      <tr>
        <td colSpan={columnCount}>
          <FullPageLoading />
        </td>
      </tr>
    );
  }

  if (!results?.length) {
    return (
      <tr>
        <td colSpan={columnCount}>No results found.</td>
      </tr>
    );
  }

  return <>{results.map(renderRow)}</>;
}
