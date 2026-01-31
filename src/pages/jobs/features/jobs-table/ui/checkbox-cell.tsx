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
  return (
    <div className={cn('flex items-center justify-center', className)}>
      <Checkbox
        checked={value}
        onCheckedChange={(checked) => onChange(checked === true)}
      />
    </div>
  );
};
