import {
  Control,
  FieldValues,
  Path,
  useController,
  useFormContext,
} from 'react-hook-form';
import { CSSProperties, ReactElement, ReactNode } from 'react';
import clsx from 'clsx';
import { format, isDate } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import { FormLabel } from '../../bootstrap';
import { FormError } from '../../bootstrap/FormError';
import { FormText } from '../../bootstrap/FormText';

type HookFormDateInputType = 'date' | 'datetime-local';

type FormInputProps<T extends FieldValues> = {
  autoComplete?: string;
  autoFocus?: boolean;
  className?: string;
  control?: Control<T>;
  disabled?: boolean;
  helpText?: string;
  inputClassName?: string;
  inputPrependText?: string;
  label?: ReactNode;
  labelClassName?: string;
  name: Path<T>;
  readOnly?: boolean;
  required?: boolean;
  style?: CSSProperties;
  // Type is not required for backwards compatibility.
  type?: HookFormDateInputType;
};

// This relies on using storing date as Date | null in the form values.
// NOTE: If type is not set, it defaults to 'date'.
export function HookFormDateInput<T extends FieldValues>({
  name,
  control: _control,
  label,
  className,
  inputClassName,
  labelClassName,
  helpText,
  inputPrependText,
  required,
  ...inputProps
}: FormInputProps<T>): ReactElement | null {
  // If not set, default to 'date' (so type can be an optional prop for backwards compat).
  let type: HookFormDateInputType = 'date';
  if (inputProps.type) {
    type = inputProps.type;
  }

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
    field: { value: _rawValue, ...field },
    fieldState: { error },
  } = useController({
    name,
    control,
    rules: {
      required,
    },
  });

  // Handle date objects or strings or null/undefined.
  let value = '';
  if (_rawValue) {
    if (isDate(_rawValue)) {
      if (type === 'datetime-local') {
        value = formatInTimeZone(_rawValue, 'UTC', `yyyy-MM-dd'T'HH:mm:ss`);
      } else {
        value = format(_rawValue, 'yyyy-MM-dd');
      }
    } else {
      value = _rawValue;
    }
  }

  return (
    <div className={clsx(className, 'has-validation')} aria-live="polite">
      {label && (
        <FormLabel
          htmlFor={name}
          required={required}
          className={clsx(labelClassName)}
        >
          {label}
        </FormLabel>
      )}
      <div className={clsx({ 'input-group': inputPrependText })}>
        {inputPrependText && (
          <span className="input-group-text">{inputPrependText}</span>
        )}
        <input
          {...inputProps}
          {...field}
          // Must override type.
          type={type}
          value={value}
          id={name}
          className={clsx(inputClassName, { 'is-invalid': error })}
          aria-invalid={error ? 'true' : 'false'}
          aria-errormessage={error ? `${name}Error` : undefined}
          required={required}
        />
      </div>
      {helpText && <FormText ariaDescribedBy={name}>{helpText}</FormText>}
      {error && <FormError id={`${name}Error`}>{error.message}</FormError>}
    </div>
  );
}
