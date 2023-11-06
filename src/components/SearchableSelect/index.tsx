import {
  FocusEventHandler,
  forwardRef,
  ReactNode,
  useEffect,
  useState,
} from 'react';
import Select, { FormatOptionLabelMeta, SelectInstance } from 'react-select';
import clsx from 'clsx';

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
  inputId: string;
  // Something that can be used to show that a filter is currently active.
  isActive?: boolean;
  onBlur: FocusEventHandler<HTMLInputElement> | undefined;
  onChange: (value: string | null) => void;
  options: Option[];
  value: string | null;
};

export const SearchableSelect = forwardRef<
  SelectInstance<Option>,
  SearchableSelectProps
>(
  (
    {
      options,
      onBlur,
      onChange,
      isActive,
      inputId,
      formatOptionLabel,
      value,
      className,
      autoFocus,
    },
    ref
  ) => {
    const [selected, setSelected] = useState<Option | null>(null);

    // @todo: debounce.
    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
      if (!value) {
        setSelected(null);
        return;
      }
      const foundOption = options?.find((p) => p.value === value);

      if (!foundOption) {
        // eslint-disable-next-line no-console
        console.error(`could not find selected option by value: ${value}`);
        setSelected(null);
        return;
      }
      setSelected(foundOption);
    }, [value]);

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
        />
      </div>
    );
  }
);
