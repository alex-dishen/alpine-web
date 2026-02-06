import { useState, useRef, useEffect } from 'react';
import { ExternalLink } from 'lucide-react';
import { Input } from '@/shared/shadcn/components/input';
import { cn } from '@/shared/shadcn/utils/utils';

type UrlCellProps = {
  value: string | null;
  onChange: (value: string | null) => void;
  placeholder?: string;
  className?: string;
};

export const UrlCell = ({
  value,
  onChange,
  placeholder = 'Add URL',
  className,
}: UrlCellProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('');
  const [localValue, setLocalValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleStartEditing = () => {
    setEditValue(localValue ?? '');
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    const newValue = editValue.trim() || null;

    if (newValue !== value) {
      setLocalValue(newValue);
      onChange(newValue);
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

  const handleLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (localValue) {
      window.open(localValue, '_blank', 'noopener,noreferrer');
    }
  };

  if (isEditing) {
    return (
      <Input
        ref={inputRef}
        type="url"
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder="https://"
        className={cn('h-8 w-full', className)}
      />
    );
  }

  // Extract domain for display
  const displayLabel = localValue
    ? (() => {
        try {
          const url = new URL(localValue);

          return url.hostname.replace('www.', '');
        } catch {
          return localValue;
        }
      })()
    : null;

  return (
    <div
      onClick={handleStartEditing}
      className={cn(
        'hover:bg-muted/50 flex min-h-[36px] w-full cursor-text items-center gap-2 truncate px-2',
        !localValue && 'text-muted-foreground',
        className
      )}
    >
      {localValue ? (
        <>
          <span className="truncate">{displayLabel}</span>
          <ExternalLink
            className="text-muted-foreground hover:text-foreground size-4 shrink-0 cursor-pointer"
            onClick={handleLinkClick}
          />
        </>
      ) : (
        placeholder
      )}
    </div>
  );
};
