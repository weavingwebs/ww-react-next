import { FC, ThHTMLAttributes } from 'react';
import clsx from 'clsx';

export type HeaderCellProps = Omit<
  ThHTMLAttributes<HTMLTableCellElement>,
  'scope'
>;

export const TableHeaderCell: FC<HeaderCellProps> = ({
  children,
  className,
  ...props
}) => (
  <th scope="col" className={clsx(className)} {...props}>
    {children}
  </th>
);
