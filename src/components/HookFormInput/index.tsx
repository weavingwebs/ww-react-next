import { Control, FieldValues, Path, useController } from 'react-hook-form';
import {
  CSSProperties,
  HTMLInputTypeAttribute,
  JSX,
  ReactElement,
  ReactNode,
} from 'react';
import clsx from 'clsx';
import { FormLabel } from '../../bootstrap';
import { FormError } from '../../bootstrap/FormError';
import { FormText } from '../../bootstrap/FormText';

type FormInputPropsSelect = {
  as: 'select';
  children: ReactNode;
  autoComplete?: string;
};

type FormInputPropsTextarea = {
  as: 'textarea';
  rows?: number;
  placeholder?: string;
  readOnly?: boolean;
  spellCheck?: 'true' | 'false';
  autoCorrect?: 'on' | 'off';
  autoCapitalize?: string;
  autoComplete?: string;
};

type FormInputPropsInput = {
  as?: undefined;
  type?: HTMLInputTypeAttribute;
  placeholder?: string;
  readOnly?: boolean;
  spellCheck?: 'true' | 'false';
  autoCorrect?: 'on' | 'off';
  autoCapitalize?: string;
  autoComplete?: string;
};

type FormInputProps<T extends FieldValues> = (
  | FormInputPropsSelect
  | FormInputPropsTextarea
  | FormInputPropsInput
) & {
  control: Control<T>;
  name: Path<T>;
  required?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;
  label?: ReactNode;
  className?: string;
  inputClassName?: string;
  helpText?: string;
  style?: CSSProperties;
  min?: string | number;
  max?: string | number;
  inputPrependText?: string;
};

export function HookFormInput<T extends FieldValues>({
  name,
  control,
  required,
  label,
  className,
  inputClassName,
  helpText,
  style,
  inputPrependText,
  ...asProps
}: FormInputProps<T>): ReactElement | null {
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

  const { as, ...inputProps } = asProps;
  let Component: keyof JSX.IntrinsicElements = 'input';
  switch (as) {
    case 'select': {
      Component = 'select';
      break;
    }
    case 'textarea': {
      Component = 'textarea';
      break;
    }
  }

  return (
    <div className={clsx(className, 'has-validation')} aria-live="polite">
      {label && (
        <FormLabel htmlFor={name} required={required}>
          {label}
        </FormLabel>
      )}
      <div className={clsx({ 'input-group': inputPrependText })}>
        {inputPrependText && (
          <span className="input-group-text">{inputPrependText}</span>
        )}
        <Component
          {...inputProps}
          {...field}
          onBlur={(ev) => {
            const value = ev.target.value;
            field.onChange(value.trim());
            field.onBlur();
          }}
          id={name}
          className={clsx(inputClassName, { 'is-invalid': error })}
          aria-invalid={name ? 'true' : 'false'}
          aria-errormessage={name ? `${name}Error` : undefined}
          style={style}
          required={required}
        />
      </div>
      {helpText && <FormText ariaDescribedBy={name}>{helpText}</FormText>}
      {error && <FormError id={`${name}Error`}>{error.message}</FormError>}
    </div>
  );
}
