import { Meta, StoryObj } from '@storybook/react';
import { object, string } from 'yup';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, BsFormError, BsFormLabel } from '../../../bootstrap';

const validationSchema = object({
  radio: string().label('Radio').required().min(1),
});

export const RadiosUsingRawInputs: StoryObj = () => {
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
      <form
        // We are validating using yup so we don't want HTML validation get in our way.
        // e.g. setting type="email" or required would trigger HTML validation.
        noValidate
        // eslint-disable-next-line no-alert
        onSubmit={handleSubmit((values) => alert(JSON.stringify(values)))}
      >
        <div>
          <fieldset>
            <BsFormLabel as="legend" required>
              What was the weather like?
            </BsFormLabel>

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
            <BsFormError id="selectError" error={errors.radio} />
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

RadiosUsingRawInputs.storyName = 'Radios: raw inputs';

export default {
  title: 'Examples/Forms',
  component: RadiosUsingRawInputs,
} as Meta<typeof RadiosUsingRawInputs>;
