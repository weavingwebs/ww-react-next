import { Meta } from '@storybook/react';
import { FC } from 'react';
import { object, string } from 'yup';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, BsFormError, BsFormLabel } from '../../bootstrap';
import { SearchableSelect } from '../../components';
import { MOCK_OPTIONS } from '../mocks';

const validationSchema = object({
  select: string().label('Select').required(),
});

type SearchableSelectInFormProps = {
  initialSelectValue?: string;
};

export const SearchableSelectInForm: FC<SearchableSelectInFormProps> = ({
  initialSelectValue,
}) => {
  const formMethods = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: { select: initialSelectValue || '' },
  });

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = formMethods;

  return (
    <FormProvider {...formMethods}>
      <form
        // We are validating using yup so we don't want HTML validation get in our way.
        // e.g. setting type="email" or required would trigger HTML validation.
        noValidate
        // eslint-disable-next-line no-alert
        onSubmit={handleSubmit((values) => alert(JSON.stringify(values)))}
      >
        <div className="mb-3" aria-live="polite">
          <BsFormLabel htmlFor="select" required>
            Label
          </BsFormLabel>
          <Controller
            control={control}
            name="select"
            render={({ field: { onChange, value, onBlur, ref } }) => (
              <SearchableSelect
                ref={ref}
                inputId="select"
                getOptions={MOCK_OPTIONS}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                inputClassName="form-select"
              />
            )}
          />
          {errors.select && (
            <BsFormError id="selectError" error={errors.select} />
          )}
        </div>

        <Button variant="primary" type="submit" disabled={isSubmitting}>
          Submit
        </Button>
      </form>
    </FormProvider>
  );
};

export default {
  title: 'Components/SearchableSelect',
  component: SearchableSelectInForm,
} as Meta<typeof SearchableSelectInForm>;
