import { useState, useEffect } from 'react';
import { Checkbox } from '@/shared/shadcn/components/checkbox';
import { cn } from '@/shared/shadcn/utils/utils';

type CheckboxCellProps = {
  value: boolean;
  onChange: (value: boolean) => void;
  className?: string;
};

export const CheckboxCell = ({
  value,
  onChange,
  className,
}: CheckboxCellProps) => {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (checked: boolean) => {
    setLocalValue(checked);
    onChange(checked);
  };

  return (
    <div
      className={cn(
        'hover:bg-muted/50 flex min-h-[36px] w-full cursor-pointer items-center justify-center',
        className
      )}
      onClick={() => handleChange(!localValue)}
    >
      <Checkbox
        checked={localValue}
        onCheckedChange={(checked) => handleChange(checked === true)}
        className="pointer-events-none"
      />
    </div>
  );
};
