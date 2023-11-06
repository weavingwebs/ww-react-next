import mockData from './mockData.json';

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
  // yyyy-mm-dd format.
  dateOfBirth: string;
  // An enum.
  gender: 'male' | 'female' | 'other';
  // GUID assigned by the server.
  id: string;
  name: string;
  phone: string;
  // Server timestamps on during creation.
  registered: string;
};

export type CustomerInput = Omit<CustomerFragment, 'id' | 'registered'>;
