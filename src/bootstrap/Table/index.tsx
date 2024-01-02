import { FC, PropsWithChildren, ReactNode } from 'react';
import clsx from 'clsx';

export type TableProps = PropsWithChildren & {
  // Tip: Use <><HeaderCell>Column Name</HeaderCell>...</>
  columns: ReactNode;
  notResponsive?: boolean;
  rowHover?: boolean;
  size?: 'sm';
  striped?: boolean;
  tableClassName?: string;
  tbodyClassName?: string;
  theadClassName?: string;
};

// Warning: Do not use table striped class. It will not work with <TableRow/> disableHover prop.
export const Table: FC<TableProps> = ({
  columns,
  rowHover,
  striped,
  size,
  tableClassName,
  theadClassName,
  tbodyClassName,
  notResponsive,
  children,
}) => (
  <div className={clsx({ 'table-responsive': !notResponsive })}>
    <table
      className={clsx(
        'table',
        {
          'table-striped': striped,
          'table-hover': rowHover,
        },
        size && `table-${size}`,
        tableClassName
      )}
    >
      {columns && (
        <thead className={clsx(theadClassName)}>
          <tr>{columns}</tr>
        </thead>
      )}
      <tbody className={clsx(tbodyClassName)}>{children}</tbody>
    </table>
  </div>
);
