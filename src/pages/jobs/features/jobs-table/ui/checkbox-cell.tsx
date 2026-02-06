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
    <div
      className={cn(
        'hover:bg-muted/50 flex min-h-[36px] w-full cursor-pointer items-center justify-center',
        className
      )}
      onClick={() => onChange(!value)}
    >
      <Checkbox
        checked={value}
        onCheckedChange={(checked) => onChange(checked === true)}
        className="pointer-events-none"
      />
    </div>
  );
};
