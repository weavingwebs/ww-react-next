import { Source } from '@storybook/blocks';
import { Meta } from '@storybook/react';
import { FC, useEffect } from 'react';
import { usePager } from '../../hooks';

export const Example: FC<{
  itemsPerPage: number;
  total: number;
}> = ({ itemsPerPage, total }) => {
  const pager = usePager(itemsPerPage, total);

  useEffect(() => {
    pager.dispatch({ type: 'updateItemsPerPage', itemsPerPage });
  }, [itemsPerPage]);
  useEffect(() => {
    pager.dispatch({ type: 'update', total });
  }, [total]);

  return (
    <div>
      <button
        type="button"
        className="btn btn-outline-secondary me-2"
        onClick={() => pager.dispatch({ type: 'prev' })}
        disabled={pager.currentPage === 1}
      >
        Prev
      </button>
      {`${pager.currentPage} / ${pager.totalPages} `}
      <button
        type="button"
        className="btn btn-outline-secondary me-2"
        onClick={() => pager.dispatch({ type: 'next' })}
        disabled={pager.isLastPage}
      >
        Next
      </button>
      <button
        type="button"
        className="btn btn-outline-secondary me-2"
        onClick={() => pager.dispatch({ type: 'reset' })}
        disabled={pager.currentPage === 1}
      >
        Reset
      </button>
      <Source code={JSON.stringify(pager, null, '  ')} language="json" />
    </div>
  );
};

const meta: Meta = {
  title: 'Hooks/usePager',
  component: Example,
  args: {
    itemsPerPage: 50,
    total: 283,
  },
};

export default meta;
