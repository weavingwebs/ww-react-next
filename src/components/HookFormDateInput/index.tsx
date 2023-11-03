import {
  Control,
  FieldValues,
  Path,
  useController,
  useFormContext,
} from 'react-hook-form';
import { CSSProperties, ReactElement, ReactNode } from 'react';
import clsx from 'clsx';
import { format, isValid, parse } from 'date-fns';
import { FormLabel } from '../../bootstrap';
import { FormError } from '../../bootstrap/FormError';
import { FormText } from '../../bootstrap/FormText';

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
};

// This relies on using storing date as Date | null in the form values.
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

  const getFieldValue = (): string => {
    if (
      typeof field.value === 'undefined' ||
      field.value === null ||
      !isValid(field.value)
    ) {
      return '';
    }
    return format(field.value, 'yyyy-MM-dd');
  };

  const runOnChange = (value: string | null | undefined) => {
    if (!value) {
      field.onChange('');
      return;
    }
    const parsed = parse(value, 'yyyy-MM-dd', new Date());
    if (!isValid(parsed)) {
      field.onChange('');
      return;
    }
    field.onChange(parsed);
  };

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
          type="date"
          value={getFieldValue()}
          onChange={(ev) => runOnChange(ev.target.value)}
          onBlur={(ev) => {
            const { value } = ev.target;
            runOnChange(value);
            field.onBlur();
          }}
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
