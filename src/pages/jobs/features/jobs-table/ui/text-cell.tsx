import { useState, useRef, useEffect } from 'react';
import { Input } from '@/shared/shadcn/components/input';
import { cn } from '@/shared/shadcn/utils/utils';

type TextCellProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
};

export const TextCell = ({
  value,
  onChange,
  placeholder = 'Empty',
  className,
}: TextCellProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleStartEditing = () => {
    setEditValue(value);
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);

    if (editValue !== value) {
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
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
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
        'hover:bg-muted/50 cursor-text truncate rounded px-2 py-1',
        !value && 'text-muted-foreground',
        className
      )}
    >
      {value || placeholder}
    </div>
  );
};
