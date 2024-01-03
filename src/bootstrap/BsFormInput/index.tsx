import { FieldValues } from 'react-hook-form';
import clsx from 'clsx';
import { useMemo } from 'react';
import {
  FormInput,
  FormInputBaseProps,
  FormInputPropsInput,
  FormInputPropsSelect,
  FormInputPropsTextarea,
} from '../../components/FormInput';
import { BsFormError } from '../BsFormError';
import { BsFormLabel } from '../BsFormLabel';
import { BsFormText } from '../BsFormText';

export type BsFormInputProps<T extends FieldValues> = (
  | FormInputPropsSelect
  | FormInputPropsTextarea
  | FormInputPropsInput
) &
  Omit<
    FormInputBaseProps<T>,
    'FormErrorComponent' | 'FormLabelComponent' | 'HelpTextComponent'
  >;

export function BsFormInput<T extends FieldValues>({
  className,
  inputWrapperClassName,
  inputClassName,
  inputInvalidClassName,
  ...props
}: BsFormInputProps<T>) {
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
    <FormInput
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
      inputClassName={clsx(
        props.as === 'select' ? 'form-select' : 'form-control',
        inputClassName
      )}
      inputPrefix={inputPrefix}
      inputSuffix={inputSuffix}
    />
  );
}
