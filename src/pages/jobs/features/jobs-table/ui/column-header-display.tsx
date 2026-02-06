type ColumnHeaderDisplayProps = {
  icon: React.ComponentType<{ className?: string }>;
  name: string;
  hasFilterIndicator?: boolean;
  hasSortIndicator?: boolean;
};

export const ColumnHeaderDisplay = ({
  icon: Icon,
  name,
  hasFilterIndicator,
  hasSortIndicator,
}: ColumnHeaderDisplayProps) => {
  return (
    <div className="flex w-full items-center gap-2">
      <Icon className="size-4 shrink-0" />
      <span className="truncate">{name}</span>
      {hasSortIndicator && (
        <span className="size-1.5 shrink-0 rounded-full bg-amber-500" />
      )}
      {hasFilterIndicator && (
        <span className="size-1.5 shrink-0 rounded-full bg-blue-500" />
      )}
    </div>
  );
};
