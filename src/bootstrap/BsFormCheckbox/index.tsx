import { ReactElement, useMemo } from 'react';
import { FieldValues } from 'react-hook-form';
import clsx from 'clsx';
import { FormCheckbox, FormCheckboxProps } from '../../components/FormCheckbox';
import { BsFormError } from '../BsFormError';
import { BsFormLabel } from '../BsFormLabel';
import { BsFormText } from '../BsFormText';

export type BsFormCheckboxProps<T extends FieldValues> = Omit<
  FormCheckboxProps<T>,
  'FormErrorComponent' | 'FormLabelComponent' | 'HelpTextComponent'
> & {
  // Add an empty label to align the checkbox with other inputs on the same row.
  labelSpacer?: boolean;
};

export function BsFormCheckbox<T extends FieldValues>({
  labelSpacer,
  prefix,
  labelClassName,
  inputWrapperClassName,
  inputClassName,
  className,
  ...props
}: BsFormCheckboxProps<T>): ReactElement | null {
  const prefixAndSpacer = useMemo(() => {
    if (!prefix && !labelSpacer) {
      return undefined;
    }
    if (!labelSpacer) {
      return prefix;
    }
    return (
      <>
        {prefix}
        <figure className="form-label opacity-0">&nbsp;</figure>
      </>
    );
  }, [prefix, labelSpacer]);

  return (
    <FormCheckbox
      {...props}
      FormErrorComponent={BsFormError}
      FormLabelComponent={BsFormLabel}
      HelpTextComponent={BsFormText}
      inputWrapperClassName={clsx('form-check', inputWrapperClassName)}
      inputClassName={clsx('form-check-input', inputClassName)}
      inputInvalidClassName="is-invalid"
      labelClassName={clsx('form-check-label', labelClassName)}
      prefix={prefixAndSpacer}
    />
  );
}
