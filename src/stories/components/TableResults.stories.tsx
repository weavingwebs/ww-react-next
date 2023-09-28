import { FC } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import mockData from '../mocks/mockData.json';
import { TableResults } from '../../components/TableResults';

export const Example: FC<{
  isLoading: boolean;
  showError: boolean;
}> = ({ showError, isLoading }) => {
  const data = mockData.slice(0, 10);

  return (
    <table className="table">
      <thead>
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Age</th>
          <th scope="col">Gender</th>
          <th scope="col">Company</th>
          <th scope="col">Email</th>
          <th scope="col">Telephone</th>
        </tr>
      </thead>
      <tbody>
        <TableResults
          columnCount={6}
          error={showError ? new Error('Mock error') : null}
          errorPrefix="Failed to get results"
          isLoading={isLoading}
          results={data}
          renderRow={(person) => (
            <tr key={person.id}>
              <td>{person.name}</td>
              <td>{person.age}</td>
              <td>{person.gender}</td>
              <td>{person.company}</td>
              <td>{person.email}</td>
              <td>{person.phone}</td>
            </tr>
          )}
        />
      </tbody>
    </table>
  );
};

const meta: Meta = {
  title: 'Components/TableResults',
  component: Example,
  args: {
    isLoading: false,
    showError: false,
  },
};

export default meta;

const Template: StoryObj = {
  story: meta,
  args: {
    isLoading: false,
    showError: false,
  },
};

export const LoadingState = {
  ...Template,
  args: { ...Template.args, isLoading: true },
};

export const ErrorState = {
  ...Template,
  args: { ...Template.args, showError: true },
};
