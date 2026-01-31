import { Check } from 'lucide-react';
import { Button } from '@/shared/shadcn/components/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/shadcn/components/popover';
import { STAGE_COLOR_PRESETS } from '@/pages/jobs/registry/jobs.constants';

type ColorPickerProps = {
  value: string;
  onChange: (color: string) => void;
  compact?: boolean;
};

export const ColorPicker = ({ value, onChange, compact }: ColorPickerProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={compact ? 'size-8 p-0' : 'w-full justify-start'}
        >
          <span
            className="size-4 rounded-full"
            style={{ backgroundColor: value }}
          />
          {!compact && <span className="ml-2">{value}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <div className="grid grid-cols-6 gap-2">
          {STAGE_COLOR_PRESETS.map((color) => (
            <button
              key={color}
              className="flex size-8 items-center justify-center rounded-md border-2 transition-colors"
              style={{
                backgroundColor: color,
                borderColor: value === color ? 'white' : 'transparent',
              }}
              onClick={() => onChange(color)}
            >
              {value === color && <Check className="size-4 text-white" />}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};
