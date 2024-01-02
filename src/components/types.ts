import { CSSProperties, PropsWithChildren } from 'react';
import { FieldError } from 'react-hook-form';

export type FormLabelPropsLegend = {
  as: 'legend';
};

export type FormLabelPropsLabel = {
  as?: undefined;
  htmlFor: string;
};

export type FormLabelProps = PropsWithChildren &
  (FormLabelPropsLegend | FormLabelPropsLabel) & {
    className?: string;
    required?: boolean;
    style?: CSSProperties;
  };

export type HelpTextComponentProps = PropsWithChildren<{
  ariaDescribedBy: string;
}>;

export type FormErrorComponentProps = { error: FieldError; id: string };
