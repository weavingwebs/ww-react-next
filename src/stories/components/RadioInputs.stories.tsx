import { Meta } from '@storybook/react';
import { FC } from 'react';
import { object, string } from 'yup';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from '../../bootstrap/Button';
import { FormError } from '../../bootstrap/FormError';
import { FormLabel } from '../../bootstrap';

const validationSchema = object({
  radio: string().label('Radio').required().min(1),
});

export const RadioInputs: FC = () => {
  const formMethods = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: { radio: '' }, // 'Sunny' to test default.
  });

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    control,
  } = formMethods;

  const liveValues = useWatch({ control });

  // When calling useWatch do inputs become controlled? Question.
  // eslint-disable-next-line no-console
  console.log({ liveValues });

  return (
    <FormProvider {...formMethods}>
      {/* eslint-disable-next-line no-alert */}
      <form onSubmit={handleSubmit((values) => alert(JSON.stringify(values)))}>
        <div>
          <fieldset>
            <FormLabel as="legend" required>
              What was the weather like?
            </FormLabel>

            <div className="form-check">
              <label className="form-check-label" htmlFor="radioSunny">
                Sunny
                <input
                  {...register('radio')}
                  id="radioSunny"
                  type="radio"
                  value="Sunny"
                  className="form-check-input"
                />
              </label>
            </div>

            <div className="form-check">
              <label className="form-check-label" htmlFor="radioRainy">
                Rainy
                <input
                  {...register('radio')}
                  id="radioRainy"
                  type="radio"
                  value="Rainy"
                  className="form-check-input"
                />
              </label>
            </div>

            <div className="form-check">
              <label className="form-check-label" htmlFor="radioCloudy">
                Cloudy
                <input
                  {...register('radio')}
                  id="radioCloudy"
                  type="radio"
                  value="Cloudy"
                  className="form-check-input"
                />
              </label>
            </div>
          </fieldset>

          {errors.radio && (
            <FormError id="selectError">{errors.radio.message}</FormError>
          )}
        </div>

        <Button
          variant="primary"
          type="submit"
          disabled={isSubmitting}
          className="mt-3"
        >
          Submit
        </Button>
      </form>
    </FormProvider>
  );
};

export default {
  title: 'Components/RadioInputs',
  component: RadioInputs,
} as Meta<typeof RadioInputs>;
