import { FieldValues } from 'react-hook-form';
import { useMemo } from 'react';
import clsx from 'clsx';
import { FormDateProps, FormDate } from '../../components/FormDate';
import { BsFormError } from '../BsFormError';
import { BsFormLabel } from '../BsFormLabel';
import { BsFormText } from '../BsFormText';

export type BsFormDateProps<T extends FieldValues> = Omit<
  FormDateProps<T>,
  'FormErrorComponent' | 'FormLabelComponent' | 'HelpTextComponent'
>;

export function BsFormDate<T extends FieldValues>({
  className,
  inputWrapperClassName,
  inputClassName,
  inputInvalidClassName,
  ...props
}: BsFormDateProps<T>) {
  const inputPrefix = useMemo(() => {
    if (!props.inputPrefix) {
      return undefined;
    }
    return <span className="input-group-text">{props.inputPrefix}</span>;
  }, [props.inputPrefix]);

  const inputSuffix = useMemo(() => {
    if (!props.inputSuffix) {
      return undefined;
    }
    return <span className="input-group-text">{props.inputSuffix}</span>;
  }, [props.inputSuffix]);

  return (
    <FormDate
      {...props}
      FormErrorComponent={BsFormError}
      FormLabelComponent={BsFormLabel}
      HelpTextComponent={BsFormText}
      className={clsx('has-validation', className)}
      inputWrapperClassName={clsx(
        { 'input-group': !!(inputPrefix || inputSuffix) },
        inputWrapperClassName
      )}
      inputInvalidClassName="is-invalid"
      inputClassName={clsx('form-control', inputClassName)}
      inputPrefix={inputPrefix}
      inputSuffix={inputSuffix}
    />
  );
}
