import { AnySchema } from 'yup';

// Transform undefined or '' values to null.
// This is often required for sensible handling of numbers or dates that need an empty initial value.
export function transformEmptyToNull<T extends AnySchema>(
  this: T,
  value: any,
  originalValue: any,
  _schema: T
) {
  if (typeof originalValue === 'undefined' || originalValue === '') {
    return null;
  }
  return value;
}
