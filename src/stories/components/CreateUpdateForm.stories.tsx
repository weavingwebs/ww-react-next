import { Meta } from '@storybook/react';
import { FC } from 'react';
import { date, mixed, number, object, ObjectSchema, string } from 'yup';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { HookFormInput } from '../../components/HookFormInput';
import { parse } from 'date-fns';
import {Button} from "../../bootstrap/Button";

const fragmentToValues = (fragment: MyFragment): FormValues => ({
  age: fragment.age,
  company: fragment.company,
  name: fragment.name,
  dateOfBirth: parse(fragment.dateOfBirth, 'yyyy-mm-dd', new Date()),
  gender: fragment.gender,
  phone: fragment.phone,
});

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
  name: string().label('Name').required().max(3),
  phone: string().label('Phone number').required(),
});

type CreateUpdateFormProps = {
  myFragment: MyFragment | null;
};

export const CreateUpdateForm: FC<CreateUpdateFormProps> = ({ myFragment }) => {
  const formMethods = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: myFragment ? fragmentToValues(myFragment) : {},
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = formMethods;

  return (
    <FormProvider {...formMethods}>
      <form
        onSubmit={handleSubmit((values) => {
          console.log({ values });
        })}
      >
        <HookFormInput<FormValues>
          control={control}
          name="name"
          label="Name"
          helpText="Just some help text."
          inputClassName="form-control"
          className="mb-3"
        />

        <Button variant="primary" type="submit">Submit</Button>
      </form>
    </FormProvider>
  );
};

export default {
  title: 'Components/CreateUpdateForm',
  component: CreateUpdateForm,
  argTypes: {},
  tags: ['autodocs'],
} as Meta<typeof CreateUpdateForm>;
