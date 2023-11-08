import { Meta } from '@storybook/react';
import { FC } from 'react';
import { array, object, string } from 'yup';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from '../../bootstrap/Button';
import { FormError } from '../../bootstrap/FormError';

const validationSchema = object({
  checkbox: array(string()).label('Checkbox').required().min(1),
});

export const MultipleCheckboxesFormRawInputs: FC = () => {
  const formMethods = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: { checkbox: [] },
  });

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = formMethods;

  return (
    <FormProvider {...formMethods}>
      {/* eslint-disable-next-line no-alert */}
      <form onSubmit={handleSubmit((values) => alert(JSON.stringify(values)))}>
        <div>
          <div className="form-check">
            <label className="form-check-label" htmlFor="checkbox1">
              Checkbox 1
              <input
                {...register('checkbox')}
                id="checkbox1"
                type="checkbox"
                value="1"
                className="form-check-input"
              />
            </label>
          </div>

          <div className="form-check">
            <label className="form-check-label" htmlFor="checkbox2">
              Checkbox 2
              <input
                {...register('checkbox')}
                id="checkbox2"
                type="checkbox"
                value="2"
                className="form-check-input"
              />
            </label>
          </div>

          <div className="form-check">
            <label className="form-check-label" htmlFor="checkbox3">
              Checkbox 3
              <input
                {...register('checkbox')}
                id="checkbox3"
                type="checkbox"
                value="3"
                className="form-check-input"
              />
            </label>
          </div>

          <div className="form-check">
            <label className="form-check-label" htmlFor="checkbox4">
              Checkbox 4
              <input
                {...register('checkbox')}
                id="checkbox4"
                type="checkbox"
                value="4"
                className="form-check-input"
              />
            </label>
          </div>

          {errors.checkbox && (
            <FormError id="selectError">{errors.checkbox.message}</FormError>
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
  title: 'Components/MultipleCheckboxesForm',
  component: MultipleCheckboxesFormRawInputs,
} as Meta<typeof MultipleCheckboxesFormRawInputs>;
