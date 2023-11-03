import { Meta } from '@storybook/react';
import { FC, useState } from 'react';
import {
  boolean,
  date,
  mixed,
  number,
  object,
  ObjectSchema,
  string,
} from 'yup';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { format, isValid, parse } from 'date-fns';
import { HookFormInput } from '../../components/HookFormInput';
import { Button } from '../../bootstrap/Button';
import { CustomerFragment, CustomerInput } from '../mocks';
import { ErrorMessage, Loading } from '../../bootstrap';
import { PreventDirtyFormNavigate } from '../../components/PreventDirtyFormNavigate';
import { HookFormCheckboxInput } from '../../components/HookFormCheckboxInput';
import { HookFormDateInput } from '../../components/HookFormDateInput';

// Define the shape of the form values, overriding any props as needed for compatibility with HTML inputs.
type FormValues = Omit<
  CustomerInput,
  'dateOfBirth' | 'archived' | 'age' | 'gender'
> & {
  age: number | null;
  archived?: boolean | null;
  dateOfBirth: Date | null;
  gender: GenderEnumType | '';
};

// Convert the real values to the form values.
const fragmentToValues = async (
  fragment: CustomerFragment,
  errorOnInvalidValue: boolean
): Promise<FormValues> => {
  let dateOfBirth: Date | null = null;

  if (fragment.dateOfBirth) {
    dateOfBirth = parse(fragment.dateOfBirth, 'yyyy-MM-dd', new Date());
    // Error only if flag set & invalid value returned by server.
    if (errorOnInvalidValue && !isValid(dateOfBirth)) {
      throw new Error(
        `failed to parse dateOfBirth from '${fragment.dateOfBirth}'`
      );
    }
  }
  return {
    age: fragment.age,
    company: fragment.company,
    name: fragment.name,
    dateOfBirth,
    gender: fragment.gender || '',
    phone: fragment.phone,
    archived: fragment.archived,
  };
};

// Convert the form values to the onSubmit input.
const valuesToInput = (values: FormValues): CustomerInput => {
  if (!values.dateOfBirth) {
    throw new Error('dateOfBirth is null');
  }
  if (!values.age) {
    throw new Error('age is null');
  }
  if (!values.gender) {
    throw new Error(`gender is ''`);
  }
  return {
    age: values.age,
    company: values.company,
    name: values.name,
    dateOfBirth: format(values.dateOfBirth, 'yyyy-MM-dd'),
    gender: values.gender,
    phone: values.phone,
    archived: !!values.archived,
  };
};

type GenderEnumType = 'male' | 'female' | 'other';

const genderEnum: Record<GenderEnumType, GenderEnumType> = {
  female: 'female',
  male: 'male',
  other: 'other',
};

const GenderEnumLabels: Record<GenderEnumType, string> = {
  male: 'Male',
  female: 'Female',
  other: 'Other',
};

const validationSchema: ObjectSchema<FormValues> = object({
  age: number()
    .label('Age')
    .transform((value, originalValue) =>
      typeof originalValue === 'undefined' || originalValue === ''
        ? null
        : value
    )
    .positive()
    .required(),
  company: string().label('Company').required().max(128),
  dateOfBirth: date().label('Date of birth').required(),
  gender: mixed<GenderEnumType>()
    .oneOf(Object.values(genderEnum))
    .label('Gender')
    .transform((value, originalValue) =>
      typeof originalValue === 'undefined' || originalValue === ''
        ? null
        : value
    )
    .required(),
  name: string().label('Name').required().max(128),
  phone: string().label('Phone number').required(),
  archived: boolean().label('Archived').nullable(),
});

const initialValues: FormValues = {
  name: '',
  phone: '',
  gender: '',
  company: '',
  age: null,
  archived: null,
  dateOfBirth: null,
};

type CreateUpdateFormProps = {
  // If customer given, then it's an UpdateCustomer form, otherwise CreateCustomer.
  customer: CustomerFragment | null;
  // onCreate or onUpdate.
  onSubmit: (input: CustomerInput) => Promise<CustomerFragment>;
};

export const CreateUpdateForm: FC<CreateUpdateFormProps> = ({
  customer,
  onSubmit,
}) => {
  const [loadError, setLoadError] = useState<Error | null>(null);
  const [submitError, setSubmitError] = useState<Error | null>(null);

  const formMethods = useForm<FormValues>({
    resolver: yupResolver(validationSchema),
    defaultValues: customer
      ? async () =>
          fragmentToValues(customer, true).catch((err) => {
            setLoadError(
              new Error(
                'There were problems with loading some initial values',
                { cause: err }
              )
            );
            return fragmentToValues(customer, false);
          })
      : {
          ...initialValues,
        },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = formMethods;

  return (
    <FormProvider {...formMethods}>
      <form
        onSubmit={handleSubmit(async (values) => {
          // Reset error every submit.
          setSubmitError(null);

          try {
            const res = await onSubmit(valuesToInput(values));
            const newFormValues = await fragmentToValues(res, true).catch(
              (err) => {
                setSubmitError(
                  new Error(
                    'Saved values to server but failed to replace form state',
                    {
                      cause: err,
                    }
                  )
                );
              }
            );

            if (newFormValues) {
              reset(newFormValues);
            }

            setLoadError(null);
          } catch (err) {
            setSubmitError(new Error('Failed to save values', { cause: err }));
          }
        })}
      >
        <PreventDirtyFormNavigate />
        <ErrorMessage error={loadError} />

        <HookFormInput<FormValues>
          type="text"
          name="name"
          label="Name"
          helpText="Just some help text."
          inputClassName="form-control"
          className="mb-3"
        />

        <HookFormInput<FormValues>
          type="text"
          name="company"
          label="Company"
          inputClassName="form-control"
          className="mb-3"
        />

        <HookFormInput<FormValues>
          // We use a 'tel' for numbers so that mobile gets the numpad, it has no difference vs text on desktop.
          type="tel"
          name="age"
          label="Age"
          inputClassName="form-control"
          className="mb-3"
        />

        <HookFormDateInput<FormValues>
          type="date"
          name="dateOfBirth"
          label="Date of Birth"
          inputClassName="form-control"
          className="mb-3"
        />

        <HookFormInput<FormValues>
          type="tel"
          name="phone"
          label="Phone number"
          inputClassName="form-control"
          className="mb-3"
        />

        <HookFormInput<FormValues>
          as="select"
          name="gender"
          label="Gender"
          inputClassName="form-select"
          className="mb-3"
        >
          <option value="">Please select</option>
          <option value="invalid">Invalid option</option>
          {Object.entries(GenderEnumLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </HookFormInput>

        <HookFormCheckboxInput<FormValues>
          name="archived"
          label="Archived"
          className="mb-3"
        />

        <ErrorMessage error={submitError} />

        <Button variant="primary" type="submit" disabled={isSubmitting}>
          {isSubmitting ? <Loading colour="light" size="sm" /> : 'Submit'}
        </Button>
      </form>
    </FormProvider>
  );
};

export default {
  title: 'Components/CreateUpdateForm',
  component: CreateUpdateForm,
  args: {
    onSubmit: (input) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          // eslint-disable-next-line no-alert
          alert(
            `Successfully submitted with input: \n${JSON.stringify(
              input,
              null,
              2
            )}`
          );
          resolve({
            name: input.name,
            age: input.age,
            dateOfBirth: input.dateOfBirth,
            phone: input.phone,
            archived: input.archived,
            company: input.company,
            gender: input.gender,
            registered: 'timestamp',
            id: 'id',
          });
        }, 500);
      });
    },
  },
} as Meta<typeof CreateUpdateForm>;
