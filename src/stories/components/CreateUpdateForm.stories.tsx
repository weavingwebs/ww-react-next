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
import { formatInTimeZone, toDate } from 'date-fns-tz';
import { Button } from '../../bootstrap/Button';
import {
  CustomerFragment,
  CustomerInput,
  Gender,
  GenderLabels,
} from '../mocks';
import { ErrorMessage, Loading } from '../../bootstrap';
import { PreventDirtyFormNavigate } from '../../components/PreventDirtyFormNavigate';
import { transformEmptyToNull } from '../../util/forms';
import { useMemoOnce } from '../../hooks/useMemoOnce';
import { BsFormInput } from '../../bootstrap/BsFormInput';
import { BsFormDate } from '../../bootstrap/BsFormDate';
import { BsFormCheckbox } from '../../bootstrap/BsFormCheckbox';

// Define the shape of the form values, overriding any props as needed for compatibility with HTML inputs.
type FormValues = Omit<
  CustomerInput,
  'dateOfBirth' | 'expiresAt' | 'archived' | 'age' | 'gender'
> & {
  // We don't want to default number to 0, we want it not set (for new).
  age: number | null;
  archived: boolean;
  dateOfBirth: Date | null;
  expiresAt: Date | null;
  gender: Gender | '';
};

// Convert the real values to the form values.
const fragmentToValues = (
  fragment: CustomerFragment,
  opts?: { ignoreErrors?: boolean }
): FormValues => {
  let dateOfBirth: Date | null = null;
  let expiresAt: Date | null = null;

  if (fragment.dateOfBirth) {
    dateOfBirth = parse(fragment.dateOfBirth, 'yyyy-MM-dd', new Date());
    if (!isValid(dateOfBirth)) {
      dateOfBirth = null;
      if (!opts?.ignoreErrors) {
        throw new Error(
          `failed to parse dateOfBirth from '${fragment.dateOfBirth}'`
        );
      }
    }
  }

  if (fragment.expiresAt) {
    // Must use toDate from date-fns-tz.
    expiresAt = toDate(fragment.expiresAt);
    if (!isValid(expiresAt)) {
      expiresAt = null;
      if (!opts?.ignoreErrors) {
        throw new Error(
          `failed to parse expiresAt from '${fragment.expiresAt}'`
        );
      }
    }
  }
  return {
    age: fragment.age,
    company: fragment.company,
    name: fragment.name,
    dateOfBirth,
    expiresAt,
    gender: fragment.gender || '',
    phone: fragment.phone,
    archived: fragment.archived,
  };
};

// Convert the form values to the onSubmit input.
const valuesToInput = (values: FormValues): CustomerInput => {
  // NOTE: empty fields *should* be dealt with by the form validation but our values argument type allows them so we
  // must deal with it.
  if (!values.dateOfBirth) {
    throw new Error('dateOfBirth is null');
  }
  if (!values.expiresAt) {
    throw new Error('expiresAt is null');
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
    expiresAt: formatInTimeZone(
      values.expiresAt,
      'UTC',
      `yyyy-MM-dd'T'HH:mm:ss'Z'`
    ),
    gender: values.gender,
    phone: values.phone,
    archived: values.archived,
  };
};

const validationSchema: ObjectSchema<FormValues> = object({
  age: number()
    .label('Age')
    .transform(transformEmptyToNull)
    .positive()
    .required(),
  company: string().label('Company').required().max(128),
  dateOfBirth: date()
    .label('Date of birth')
    .required()
    .transform(transformEmptyToNull),
  expiresAt: date()
    .label('Expires at')
    .required()
    .transform(transformEmptyToNull),
  gender: mixed<Gender>()
    .oneOf(Object.values(Gender))
    .label('Gender')
    .transform(transformEmptyToNull)
    .required(),
  name: string().label('Name').required().max(128),
  phone: string().label('Phone number').required(),
  // If not defined in initial values, it will block submit without warning.
  archived: boolean().label('Archived').required(),
});

const initialValues: FormValues = {
  name: '',
  phone: '',
  gender: '',
  company: '',
  age: null,
  archived: false,
  dateOfBirth: null,
  expiresAt: null,
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

  const defaultValues: FormValues = useMemoOnce(() => {
    if (!customer) {
      return { ...initialValues };
    }

    // Try and convert the values, if it fails then show the error & just parse what we can.
    try {
      return fragmentToValues(customer);
    } catch (err) {
      setLoadError(
        new Error('There were problems with loading some initial values', {
          cause: err,
        })
      );
      return fragmentToValues(customer, { ignoreErrors: true });
    }
  });

  const formMethods = useForm<FormValues>({
    resolver: yupResolver(validationSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = formMethods;

  return (
    <FormProvider {...formMethods}>
      <form
        // We are validating using yup so we don't want HTML validation get in our way.
        // e.g. setting type="email" or required would trigger HTML validation.
        noValidate
        onSubmit={handleSubmit(async (values) => {
          // Reset error every submit.
          setSubmitError(null);

          await onSubmit(valuesToInput(values))
            .catch((err) => {
              // Wrap save error explicitly.
              throw new Error('Failed to save values', { cause: err });
            })
            .then((res) => {
              // Reset the 'default values' to the newly saved values if save succeeded.
              try {
                reset(fragmentToValues(res));
              } catch (err) {
                // Fallback to resetting the defaults to the submitted values.
                reset(values);

                throw new Error('Save successful but response was invalid', {
                  cause: err,
                });
              }
            })
            .catch(setSubmitError);
        })}
      >
        <PreventDirtyFormNavigate />
        <ErrorMessage error={loadError} />

        <BsFormInput<FormValues>
          required
          type="text"
          name="name"
          label="Name"
          helpText="Just some help text."
          inputClassName="form-control"
          className="mb-3"
        />

        <BsFormInput<FormValues>
          required
          type="text"
          name="company"
          label="Company"
          inputClassName="form-control"
          className="mb-3"
        />

        <BsFormInput<FormValues>
          required
          // We use a 'tel' for numbers so that mobile gets the numpad, it has no difference vs text on desktop.
          type="tel"
          name="age"
          label="Age"
          inputClassName="form-control"
          className="mb-3"
        />

        <BsFormDate<FormValues>
          required
          name="dateOfBirth"
          label="Date of Birth"
          inputClassName="form-control"
          className="mb-3"
        />

        <BsFormDate<FormValues>
          required
          type="datetime-local"
          name="expiresAt"
          label="Expires at"
          inputClassName="form-control"
          className="mb-3"
        />

        <BsFormInput<FormValues>
          required
          type="tel"
          name="phone"
          label="Phone number"
          inputClassName="form-control"
          className="mb-3"
        />

        <BsFormInput<FormValues>
          required
          as="select"
          name="gender"
          label="Gender"
          inputClassName="form-select"
          className="mb-3"
        >
          <option value="">Please select</option>
          <option value="invalid">Invalid option</option>
          {Object.entries(GenderLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </BsFormInput>

        <BsFormCheckbox<FormValues>
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
            expiresAt: input.expiresAt,
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
