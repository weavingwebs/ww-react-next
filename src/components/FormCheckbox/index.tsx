import {
  ChangeEvent,
  ComponentType,
  ReactElement,
  ReactNode,
  useId,
} from 'react';
import {
  Control,
  FieldValues,
  Path,
  useController,
  useFormContext,
} from 'react-hook-form';
import clsx from 'clsx';
import {
  FormErrorComponentProps,
  FormLabelProps,
  HelpTextComponentProps,
} from '../types';

export type FormCheckboxProps<T extends FieldValues> = {
  FormErrorComponent: ComponentType<FormErrorComponentProps>;
  FormLabelComponent: ComponentType<FormLabelProps>;
  HelpTextComponent: ComponentType<HelpTextComponentProps>;
  // Top level div className.
  className?: string;
  control?: Control<T>;
  disabled?: boolean;
  helpText?: ReactNode;
  // Checkbox input className.
  inputClassName?: string;
  inputInvalidClassName?: string;
  // Checkbox wrapper div className.
  inputWrapperClassName?: string;
  label: ReactNode;
  labelClassName?: string;
  name: Path<T>;
  onChange?: (ev: ChangeEvent<HTMLInputElement>) => boolean;
  // Pre-input wrapper JSX (i.e. label spacer).
  prefix?: ReactNode;
  // Only use if the checkbox MUST be ticked.
  required?: boolean;
};

export function FormCheckbox<T extends FieldValues>({
  FormErrorComponent,
  FormLabelComponent,
  HelpTextComponent,
  required,
  label,
  name,
  className,
  inputClassName,
  inputInvalidClassName,
  inputWrapperClassName,
  labelClassName,
  helpText,
  disabled,
  prefix,
  control: _control,
  onChange,
}: FormCheckboxProps<T>): ReactElement | null {
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
      {prefix}
      <div className={inputWrapperClassName}>
        <input
          {...field}
          onChange={(ev) => {
            if (onChange && !onChange(ev)) {
              return;
            }
            field.onChange(ev);
          }}
          checked={field.value}
          type="checkbox"
          id={id}
          className={clsx(inputClassName, error && inputInvalidClassName)}
          aria-invalid={error ? 'true' : 'false'}
          aria-errormessage={error ? `${name}Error` : undefined}
          disabled={disabled}
          required={required}
        />
        <FormLabelComponent
          htmlFor={id}
          required={required}
          className={labelClassName}
        >
          {label}
        </FormLabelComponent>
      </div>
      {helpText && (
        <HelpTextComponent ariaDescribedBy={id}>{helpText}</HelpTextComponent>
      )}
      {error && <FormErrorComponent id={`${name}Error`} error={error} />}
    </div>
  );
}
