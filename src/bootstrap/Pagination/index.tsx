import { FC, ReactNode } from 'react';
import clsx from 'clsx';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

type Props = {
  className?: string;
  currentPage: number;
  itemsPerPage: number;
  nextLabel?: ReactNode;
  onChange: (page: number) => void;
  paginationClasName?: string;
  prevLabel?: ReactNode;
  totalItems: number;
};

export const Pagination: FC<Props> = ({
  onChange,
  totalItems,
  itemsPerPage,
  currentPage,
  className,
  nextLabel,
  prevLabel,
  paginationClasName,
}) => {
  let totalPages = Math.ceil(totalItems / itemsPerPage);
  if (totalPages < 1) {
    totalPages = 1;
  }

  const isFirstPage = currentPage <= 1;
  const isLastPage = currentPage >= totalPages;

  return (
    <nav className={className}>
      <ul className={clsx('pagination pagination-sm', paginationClasName)}>
        <li className={clsx('page-item', { disabled: isFirstPage })}>
          <button
            type="button"
            className="page-link"
            onClick={() => {
              if (isFirstPage) {
                // eslint-disable-next-line no-console
                console.error('already on first page');
                return;
              }
              onChange(currentPage - 1);
            }}
            title="Previous page"
          >
            {prevLabel || <FaArrowLeft />}
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
                // eslint-disable-next-line no-console
                console.error('already on last page');
                return;
              }
              onChange(currentPage + 1);
            }}
            title="Next page"
          >
            {nextLabel || (
              <>
                Next
                <FaArrowRight className="ms-1" />
              </>
            )}
          </button>
        </li>
      </ul>
    </nav>
  );
};
