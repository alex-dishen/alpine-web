import { useState, useRef, useEffect } from 'react';
import { Input } from '@/shared/shadcn/components/input';
import { cn } from '@/shared/shadcn/utils/utils';

type TextCellProps = {
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'number';
  placeholder?: string;
  className?: string;
};

export const TextCell = ({
  value,
  onChange,
  type = 'text',
  placeholder = 'Empty',
  className,
}: TextCellProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('');
  const [displayValue, setDisplayValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setDisplayValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleStartEditing = () => {
    setEditValue(displayValue);
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);

    if (editValue !== value) {
      setDisplayValue(editValue);
      onChange(editValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleBlur();
    }

    if (e.key === 'Escape') {
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <Input
        ref={inputRef}
        inputMode={type === 'number' ? 'numeric' : undefined}
        value={editValue}
        onChange={(e) => {
          if (
            type === 'number' &&
            e.target.value &&
            !/^\d*$/.test(e.target.value)
          )
            return;
          setEditValue(e.target.value);
        }}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={cn('h-8 w-full', className)}
      />
    );
  }

  return (
    <div
      onClick={handleStartEditing}
      className={cn(
        'hover:bg-muted/50 flex min-h-[36px] w-full cursor-text items-center truncate px-2',
        !displayValue && 'text-muted-foreground',
        className
      )}
    >
      {displayValue || placeholder}
    </div>
  );
};
