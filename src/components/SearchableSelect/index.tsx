import {
  FocusEventHandler,
  forwardRef,
  ReactNode,
  useEffect,
  useState,
} from 'react';
import Select, {
  components,
  FormatOptionLabelMeta,
  SelectInstance,
} from 'react-select';
import clsx from 'clsx';
import { FaSearch } from 'react-icons/fa';

export type SearchableSelectOption = {
  label: string;
  value: string;
};

type SearchableSelectProps = {
  autoFocus?: boolean;
  className?: string;
  formatOptionLabel?: (
    data: SearchableSelectOption,
    formatOptionLabelMeta: FormatOptionLabelMeta<SearchableSelectOption>
  ) => ReactNode;
  getOptions:
    | SearchableSelectOption[]
    | ((where: {
        id?: string | null;
        inputValue?: string | null;
        limit: number;
      }) => Promise<SearchableSelectOption[]>);
  inputClassName?: string;
  inputId: string;
  // Something that can be used to show that a filter is currently active.
  isActive?: boolean;
  onBlur: FocusEventHandler<HTMLInputElement> | undefined;
  onChange: (value: string | null) => void;
  placeholder?: string;
  value: string | null;
};

export const SearchableSelect = forwardRef<
  SelectInstance<SearchableSelectOption>,
  SearchableSelectProps
>(
  (
    {
      getOptions,
      onBlur,
      onChange,
      isActive,
      inputId,
      formatOptionLabel,
      value,
      className,
      inputClassName,
      autoFocus,
      placeholder,
    },
    ref
  ) => {
    const [selected, setSelected] = useState<SearchableSelectOption | null>(
      null
    );

    // @todo: debounce.
    const [inputValue, setInputValue] = useState('');

    const needsToFetchOptions = !Array.isArray(getOptions);

    const [options, setOptions] = useState<SearchableSelectOption[]>(
      needsToFetchOptions ? [] : getOptions
    );

    useEffect(() => {
      if (!value) {
        setSelected(null);
        return;
      }

      if (needsToFetchOptions) {
        setLoading(true);

        getOptions({ limit: 1, id: value })
          .then((data) => {
            const foundOption = data.find((p) => p.value === value);
            if (!foundOption) {
              // eslint-disable-next-line no-console
              console.error(
                `could not find selected option by value: ${value}`
              );
              setSelected(null);
              return;
            }
            setSelected(foundOption);
          })
          // @todo: error modal
          // eslint-disable-next-line no-alert
          .catch((err) => alert(err.message))
          .finally(() => setLoading(false));
      } else {
        const foundOption = options.find((p) => p.value === value);

        if (!foundOption) {
          // eslint-disable-next-line no-console
          console.error(`could not find selected option by value: ${value}`);
          setSelected(null);
          return;
        }
        setSelected(foundOption);
      }
    }, [value]);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
      if (!needsToFetchOptions) {
        return;
      }
      if (!inputValue.trim()) {
        setOptions([]);
        return;
      }
      setLoading(true);

      getOptions({ limit: 10, inputValue })
        .then((opts) => setOptions(opts))
        // @todo: error modal
        // eslint-disable-next-line no-alert
        .catch((err) => alert(err.message))
        .finally(() => setLoading(false));
    }, [inputValue, needsToFetchOptions]);

    return (
      <div className={clsx(className)}>
        <Select
          ref={ref}
          isClearable
          isSearchable
          pageSize={1}
          autoFocus={autoFocus}
          inputId={inputId}
          value={selected}
          onChange={(opt) => onChange(opt?.value || null)}
          isLoading={loading}
          options={options}
          inputValue={inputValue}
          onInputChange={setInputValue}
          onBlur={onBlur}
          formatOptionLabel={formatOptionLabel}
          classNames={{
            control: () => clsx(inputClassName, { 'border-primary': isActive }),
            container: () => 'p-0',
            valueContainer: () => 'p-0',
            singleValue: () => 'p-0',
            input: () => 'p-0 m-0',
            indicatorsContainer: () => 'p-0',
            clearIndicator: () => 'p-0',
          }}
          styles={{
            menu: (baseStyles) => ({
              ...baseStyles,
              zIndex: 2,
            }),
          }}
          components={{
            DropdownIndicator: needsToFetchOptions
              ? // eslint-disable-next-line react/no-unstable-nested-components
                () => <FaSearch className="ms-2" size={15} />
              : undefined,
            IndicatorSeparator: needsToFetchOptions ? () => null : undefined,
            LoadingMessage: needsToFetchOptions ? () => null : undefined,
            // @todo: make these proper components.
            // eslint-disable-next-line react/no-unstable-nested-components
            Menu: (menuProps) => {
              if (menuProps.isLoading) {
                return null;
              }
              return (
                <components.Menu {...menuProps}>
                  {menuProps.children}
                </components.Menu>
              );
            },
          }}
          noOptionsMessage={needsToFetchOptions ? () => null : undefined}
          placeholder={placeholder}
        />

        {/* @todo: error modal */}
      </div>
    );
  }
);
