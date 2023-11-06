import { Meta } from '@storybook/react';
import { FC } from 'react';
import { object, string } from 'yup';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from '../../bootstrap/Button';
import { FormLabel } from '../../bootstrap';
import {
  MOCK_OPTIONS,
  SearchableSelect,
} from '../../components/SearchableSelect';
import { FormError } from '../../bootstrap/FormError';

const validationSchema = object({
  select: string().label('Select').required(),
});

export const SearchableSelectInForm: FC = () => {
  const formMethods = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: { select: '' },
  });

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = formMethods;

  return (
    <FormProvider {...formMethods}>
      {/* eslint-disable-next-line no-alert */}
      <form onSubmit={handleSubmit((values) => alert(JSON.stringify(values)))}>
        <div className="mb-3" aria-live="polite">
          <FormLabel htmlFor="select" required>
            Label
          </FormLabel>
          <Controller
            control={control}
            name="select"
            render={({ field: { onChange, value, onBlur, ref } }) => (
              <SearchableSelect
                ref={ref}
                inputId="select"
                options={MOCK_OPTIONS}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
              />
            )}
          />
          {errors.select && (
            <FormError id="selectError">{errors.select.message}</FormError>
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
  title: 'Components/SearchableSelectInForm',
  component: SearchableSelectInForm,
} as Meta<typeof SearchableSelectInForm>;
