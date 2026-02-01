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
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleStartEditing = () => {
    setEditValue(value ?? '');
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    const newValue = editValue.trim() || null;

    if (newValue !== value) {
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

    if (value) {
      window.open(value, '_blank', 'noopener,noreferrer');
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
  const displayValue = value
    ? (() => {
        try {
          const url = new URL(value);

          return url.hostname.replace('www.', '');
        } catch {
          return value;
        }
      })()
    : null;

  return (
    <div
      onClick={handleStartEditing}
      className={cn(
        'hover:bg-muted/50 flex cursor-text items-center gap-2 truncate rounded px-2 py-1',
        !value && 'text-muted-foreground',
        className
      )}
    >
      {value ? (
        <>
          <span className="truncate">{displayValue}</span>
          <ExternalLink
            className="text-muted-foreground hover:text-foreground size-4 shrink-0"
            onClick={handleLinkClick}
          />
        </>
      ) : (
        placeholder
      )}
    </div>
  );
};
