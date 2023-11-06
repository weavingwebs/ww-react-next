import {
  FocusEventHandler,
  forwardRef,
  ReactNode,
  useEffect,
  useState,
} from 'react';
import Select, {
  FormatOptionLabelMeta,
  SelectInstance,
  components,
} from 'react-select';
import clsx from 'clsx';
import { FaSearch } from 'react-icons/fa';

type Option = {
  label: string;
  value: string;
};

export const MOCK_OPTIONS: Option[] = [
  {
    label: 'My first option',
    value: '1',
  },
  {
    label: 'My second option',
    value: '2',
  },
  {
    label: 'My third option',
    value: '3',
  },
  {
    label: 'My fourth option',
    value: '4',
  },
  {
    label: 'My fifth option',
    value: '5',
  },
  {
    label: 'My sixth option',
    value: '6',
  },
  {
    label: 'My seventh option',
    value: '7',
  },
  {
    label: 'My eighth option',
    value: '8',
  },
  {
    label: 'My ninth option',
    value: '9',
  },
  {
    label: 'My tenth option',
    value: '10',
  },
  {
    label: 'My eleventh option',
    value: '11',
  },
  {
    label: 'My twelfth option',
    value: '12',
  },
  {
    label: 'My thirteenth option',
    value: '13',
  },
  {
    label: 'My fourteenth option',
    value: '14',
  },
  {
    label: 'My fifteenth option',
    value: '15',
  },
  {
    label: 'My sixteenth option',
    value: '16',
  },
  {
    label: 'My seventeenth option',
    value: '17',
  },
  {
    label: 'My eighteenth option',
    value: '18',
  },
  {
    label: 'My nineteenth option',
    value: '19',
  },
  {
    label: 'My twentieth option',
    value: '20',
  },
];

type SearchableSelectProps = {
  autoFocus?: boolean;
  className?: string;
  formatOptionLabel?: (
    data: Option,
    formatOptionLabelMeta: FormatOptionLabelMeta<Option>
  ) => ReactNode;
  getOptions:
    | Option[]
    | ((where: {
        id?: string | null;
        inputValue?: string | null;
        limit: number;
      }) => Promise<Option[]>);
  inputId: string;
  // Something that can be used to show that a filter is currently active.
  isActive?: boolean;
  onBlur: FocusEventHandler<HTMLInputElement> | undefined;
  onChange: (value: string | null) => void;
  placeholder?: string;
  value: string | null;
};

export const SearchableSelect = forwardRef<
  SelectInstance<Option>,
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
      autoFocus,
      placeholder,
    },
    ref
  ) => {
    const [selected, setSelected] = useState<Option | null>(null);

    // @todo: debounce.
    const [inputValue, setInputValue] = useState('');

    const needsToFetchOptions = !Array.isArray(getOptions);

    const [options, setOptions] = useState<Option[]>(
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
            control: () => (isActive ? 'border-primary' : ''),
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
                () => <FaSearch className="me-4" size={15} />
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
