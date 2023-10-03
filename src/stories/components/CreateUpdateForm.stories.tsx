import { Meta } from '@storybook/react';
import { FC } from 'react';
import { date, mixed, number, object, ObjectSchema, string } from 'yup';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

type MyFragment = {
  age: number;
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

type MyInput = Omit<MyFragment, 'id' | 'registered'>;

type FormValues = Omit<MyInput, 'dateOfBirth'> & {
  // Override dateOfBirth type to date object or null.
  dateOfBirth: Date | null;
};

const validationSchema: ObjectSchema<FormValues> = object({
  age: number().label('Age').required(),
  company: string().label('Company').required().max(128),
  dateOfBirth: date().label('Date of birth').required(),
  gender: mixed<'male' | 'female' | 'other'>().label('Gender').required(),
  name: string().label('Name').required(),
  phone: string().label('Phone number').required(),
});

type CreateUpdateFormProps = {
  //
};

export const CreateUpdateForm: FC<CreateUpdateFormProps> = () => {
  const formMethods = useForm({ resolver: yupResolver(validationSchema) });
  return (
    <FormProvider {...formMethods}>
      <div>CreateUpdateForm</div>
    </FormProvider>
  );
};

export default {
  title: 'Components/CreateUpdateForm',
  component: CreateUpdateForm,
  argTypes: {},
  tags: ['autodocs'],
} as Meta<typeof CreateUpdateForm>;
