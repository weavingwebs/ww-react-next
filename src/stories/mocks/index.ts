import mockData from './mockData.json';
import { SearchableSelectOption } from '../../components';

export type PagingInput = {
  limit: number;
  offset?: number | null;
};

export type MockDataItem = (typeof mockData)[0];

export type MockDataQueryResult = {
  results: MockDataItem[];
  total: number;
};

export type MockDataQueryVariables = {
  paging: PagingInput;
  where?: {
    id?: string | null;
    name?: string | null;
  } | null;
};

export const getData = async (vars: MockDataQueryVariables) =>
  new Promise<MockDataQueryResult>((resolve) => {
    setTimeout(
      () => {
        const data = mockData.filter((item) => {
          if (vars.where?.name) {
            return item.name
              .toLocaleLowerCase()
              .includes(vars.where.name.trim().toLocaleLowerCase());
          }
          if (vars.where?.id) {
            return item.id === vars.where.id;
          }
          return true;
        });
        const offset = vars.paging.offset || 0;
        const results = data.slice(offset, offset + vars.paging.limit);

        resolve({
          total: data.length,
          results,
        });
      },
      Math.random() * 500 + 50
    );
  });

export type CustomerFragment = {
  age: number;
  archived: boolean;
  company: string;
  // server date format (yyyy-MM-dd).
  dateOfBirth: string;
  // server datetime format (yyyy-MM-dd'T'HH:mm:ss'Z').
  expiresAt: string;
  // An optional enum.
  gender: Gender | null;
  // GUID assigned by the server.
  id: string;
  name: string;
  phone: string;
  // Server timestamps on during creation.
  registered: string;
};

export type CustomerInput = Omit<CustomerFragment, 'id' | 'registered'>;

export enum Gender {
  female = 'female',
  male = 'male',
  other = 'other',
}

export const GenderLabels: Record<Gender, string> = {
  male: 'Male',
  female: 'Female',
  other: 'Other',
};

export const MOCK_OPTIONS: SearchableSelectOption[] = [
  {
    label: 'My first option',
    value: '1',
  },
  {
    label: 'My second option',
    value: '2',
  },
  {
    label: 'My third option',
    value: '3',
  },
  {
    label: 'My fourth option',
    value: '4',
  },
  {
    label: 'My fifth option',
    value: '5',
  },
  {
    label: 'My sixth option',
    value: '6',
  },
  {
    label: 'My seventh option',
    value: '7',
  },
  {
    label: 'My eighth option',
    value: '8',
  },
  {
    label: 'My ninth option',
    value: '9',
  },
  {
    label: 'My tenth option',
    value: '10',
  },
  {
    label: 'My eleventh option',
    value: '11',
  },
  {
    label: 'My twelfth option',
    value: '12',
  },
  {
    label: 'My thirteenth option',
    value: '13',
  },
  {
    label: 'My fourteenth option',
    value: '14',
  },
  {
    label: 'My fifteenth option',
    value: '15',
  },
  {
    label: 'My sixteenth option',
    value: '16',
  },
  {
    label: 'My seventeenth option',
    value: '17',
  },
  {
    label: 'My eighteenth option',
    value: '18',
  },
  {
    label: 'My nineteenth option',
    value: '19',
  },
  {
    label: 'My twentieth option',
    value: '20',
  },
];
