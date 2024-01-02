import { ReactElement, useId } from 'react';
import clsx from 'clsx';
import {
  Control,
  FieldValues,
  Path,
  useController,
  useFormContext,
} from 'react-hook-form';
import { FormText } from '../../bootstrap/FormText';
import { FormError } from '../../bootstrap/FormError';
import { FormLabel } from '../../bootstrap';

type HookFormCheckboxInputProps<T extends FieldValues> = {
  className?: string;
  control?: Control<T>;
  disabled?: boolean;
  formCheckClassName?: string;
  helpText?: string;
  inputClassName?: string;
  label: string;
  labelClassName?: string;
  name: Path<T>;
  required?: boolean;
  topPadding?: boolean;
};

/** @deprecated Use BsFormCheckbox instead. */
export function HookFormCheckboxInput<T extends FieldValues>({
  required,
  label,
  name,
  className,
  inputClassName,
  formCheckClassName,
  labelClassName,
  helpText,
  disabled,
  topPadding,
  control: _control,
}: HookFormCheckboxInputProps<T>): ReactElement | null {
  const id = useId();

  const formContext = useFormContext<T>();
  let control = _control;
  if (!_control) {
    if (!formContext) {
      throw new Error(
        'You must either set the control prop or wrap this component with a FormProvider'
      );
    }
    control = formContext.control;
  }

  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
    rules: {
      required,
    },
  });

  return (
    <div className={className} aria-live="polite">
      {topPadding && <figure className="form-label opacity-0">&nbsp;</figure>}
      <div className={clsx('form-check', formCheckClassName)}>
        <input
          {...field}
          checked={field.value}
          type="checkbox"
          id={id}
          className={clsx('form-check-input', inputClassName)}
          aria-invalid={error ? 'true' : 'false'}
          aria-errormessage={error ? `${name}Error` : undefined}
          disabled={disabled}
        />
        <FormLabel
          htmlFor={id}
          required={required}
          className={clsx('form-check-label', labelClassName)}
        >
          {label}
        </FormLabel>
      </div>
      {helpText && <FormText ariaDescribedBy={name}>{helpText}</FormText>}
      {error && <FormError id={`${name}Error`}>{error.message}</FormError>}
    </div>
  );
}
