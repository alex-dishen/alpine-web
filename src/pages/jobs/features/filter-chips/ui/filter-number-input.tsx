import { X } from 'lucide-react';
import { Input } from '@/shared/shadcn/components/input';

type FilterNumberInputProps = {
  value: string;
  onChange: (value: string) => void;
};

export const FilterNumberInput = ({
  value,
  onChange,
}: FilterNumberInputProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    if (newValue !== '' && !/^-?\d*\.?\d*$/.test(newValue)) {
      return;
    }
    onChange(newValue);
  };

  const handleClear = () => {
    onChange('');
  };

  return (
    <div className="relative">
      <Input
        value={value}
        onChange={handleChange}
        placeholder="Enter a number..."
        className="h-8 pr-8"
        autoFocus
        inputMode="decimal"
      />
      {value && (
        <button
          type="button"
          onClick={handleClear}
          className="text-muted-foreground hover:text-foreground absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  );
};
