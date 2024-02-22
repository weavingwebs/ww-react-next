import {
  FieldValues,
  Path,
  useController,
  useFormContext,
} from 'react-hook-form';
import {
  ChangeEvent,
  ComponentType,
  CSSProperties,
  HTMLInputTypeAttribute,
  JSX,
  ReactElement,
  ReactNode,
  useId,
} from 'react';
import clsx from 'clsx';
import {
  FormErrorComponentProps,
  FormLabelProps,
  HelpTextComponentProps,
} from '../types';

export type FormInputPropsSelect = {
  as: 'select';
  autoComplete?: string;
  children: ReactNode;
};

export type FormInputPropsTextarea = {
  as: 'textarea';
  autoCapitalize?: string;
  autoComplete?: string;
  autoCorrect?: 'on' | 'off';
  placeholder?: string;
  readOnly?: boolean;
  rows?: number;
  spellCheck?: 'true' | 'false';
};

export type FormInputPropsInput = {
  as?: undefined | 'input';
  autoCapitalize?: string;
  autoComplete?: string;
  autoCorrect?: 'on' | 'off';
  placeholder?: string;
  readOnly?: boolean;
  spellCheck?: 'true' | 'false';
  // NOTE: checkboxes/radios should not use this component.
  type: Exclude<HTMLInputTypeAttribute, 'checkbox' | 'radio'>;
};

export type FormInputBaseProps<T extends FieldValues> = {
  FormErrorComponent: ComponentType<FormErrorComponentProps>;
  FormLabelComponent: ComponentType<FormLabelProps>;
  HelpTextComponent: ComponentType<HelpTextComponentProps>;
  autoFocus?: boolean;
  // Top level div className.
  className?: string;
  disabled?: boolean;
  helpText?: ReactNode;
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
  labelClassName?: string;
  max?: string | number;
  min?: string | number;
  name: Path<T>;
  onChange?: (
    ev: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => boolean;
  // Pre-input wrapper JSX (i.e. label spacer).
  prefix?: ReactNode;
  required?: boolean;
  step?: string;
  style?: CSSProperties;
};

export type FormInputProps<T extends FieldValues> = (
  | FormInputPropsSelect
  | FormInputPropsTextarea
  | FormInputPropsInput
) &
  FormInputBaseProps<T>;

export function FormInput<T extends FieldValues>({
  prefix,
  FormErrorComponent,
  FormLabelComponent,
  HelpTextComponent,
  name,
  required,
  label,
  className,
  inputClassName,
  inputInvalidClassName,
  labelClassName,
  helpText,
  style,
  inputPrefix,
  inputWrapperClassName,
  inputSuffix,
  onChange,
  ...asProps
}: FormInputProps<T>): ReactElement | null {
  const id = useId();

  const { control } = useFormContext<T>();

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

  let Component: keyof JSX.IntrinsicElements;
  switch (asProps.as) {
    case 'select': {
      Component = 'select';
      break;
    }
    case 'textarea': {
      Component = 'textarea';
      break;
    }
    default: {
      Component = 'input';
    }
  }
  const { as, ...inputProps } = asProps;

  return (
    <div className={className} aria-live="polite">
      {prefix}
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
        <Component
          {...inputProps}
          {...field}
          value={
            typeof field.value === 'undefined' || field.value === null
              ? ''
              : field.value
          }
          onBlur={(ev) => {
            const { value } = ev.target;
            field.onChange(value.trim());
            field.onBlur();
          }}
          onChange={(ev) => {
            if (onChange && !onChange(ev)) {
              return;
            }
            field.onChange(ev);
          }}
          id={id}
          className={clsx(inputClassName, error && inputInvalidClassName)}
          aria-invalid={error ? 'true' : 'false'}
          aria-errormessage={error ? `${name}Error` : undefined}
          style={style}
          required={required}
        />
        {inputSuffix}
      </div>
      {helpText && (
        <HelpTextComponent ariaDescribedBy={id}>{helpText}</HelpTextComponent>
      )}
      {error && <FormErrorComponent id={`${name}Error`} error={error} />}
    </div>
  );
}
