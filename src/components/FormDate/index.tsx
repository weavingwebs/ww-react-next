import {
  FieldValues,
  Path,
  useController,
  useFormContext,
} from 'react-hook-form';
import {
  ComponentType,
  CSSProperties,
  ReactElement,
  ReactNode,
  useId,
} from 'react';
import clsx from 'clsx';
import { format, isDate } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import {
  FormErrorComponentProps,
  FormLabelProps,
  HelpTextComponentProps,
} from '../types';

type FormDateType = 'date' | 'datetime-local';

export type FormDateProps<T extends FieldValues> = {
  FormErrorComponent: ComponentType<FormErrorComponentProps>;
  FormLabelComponent: ComponentType<FormLabelProps>;
  HelpTextComponent: ComponentType<HelpTextComponentProps>;
  autoComplete?: string;
  autoFocus?: boolean;
  // Top level div className.
  className?: string;
  disabled?: boolean;
  helpText?: string;
  // Input className.
  inputClassName?: string;
  inputInvalidClassName?: string;
  // Pre-input JSX (inside the input wrapper i.e. for input groups).
  inputPrefix?: ReactNode;
  // Post-input JSX (inside the input wrapper i.e. for input groups).
  inputSuffix?: ReactNode;
  // Input wrapper div className.
  inputWrapperClassName?: string;
  label?: ReactNode;
  // eslint-disable-next-line typescript-sort-keys/interface
  labelClassName?: string;
  name: Path<T>;
  prefix?: ReactNode;
  readOnly?: boolean;
  required?: boolean;
  style?: CSSProperties;
  // Type is not required for backwards compatibility.
  type?: FormDateType;
};

// This relies on using storing date as Date | null in the form values.
// NOTE: If type is not set, it defaults to 'date'.
export function FormDate<T extends FieldValues>({
  prefix,
  FormErrorComponent,
  FormLabelComponent,
  HelpTextComponent,
  name,
  label,
  className,
  inputClassName,
  inputInvalidClassName,
  labelClassName,
  helpText,
  inputPrefix,
  inputWrapperClassName,
  inputSuffix,
  required,
  ...inputProps
}: FormDateProps<T>): ReactElement | null {
  // If not set, default to 'date' (so type can be an optional prop for backwards compat).
  let type: FormDateType = 'date';
  if (inputProps.type) {
    type = inputProps.type;
  }

  const id = useId();
  const { control } = useFormContext<T>();

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
    <div className={className} aria-live="polite">
      {label && (
        <FormLabelComponent
          htmlFor={id}
          required={required}
          className={labelClassName}
        >
          {label}
        </FormLabelComponent>
      )}
      <div className={inputWrapperClassName}>
        {inputPrefix}
        <input
          {...inputProps}
          {...field}
          // Must override type.
          type={type}
          value={value}
          id={id}
          className={clsx(inputClassName, { 'is-invalid': error })}
          aria-invalid={error ? 'true' : 'false'}
          aria-errormessage={error ? `${name}Error` : undefined}
          required={required}
        />
      </div>
      {helpText && (
        <HelpTextComponent ariaDescribedBy={id}>{helpText}</HelpTextComponent>
      )}
      {error && <FormErrorComponent id={`${name}Error`} error={error} />}
    </div>
  );
}
