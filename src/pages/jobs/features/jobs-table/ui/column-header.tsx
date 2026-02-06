type ColumnHeaderProps = {
  icon: React.ComponentType<{ className?: string }>;
  name: string;
};

export const ColumnHeader = ({ icon: Icon, name }: ColumnHeaderProps) => {
  return (
    <div className="flex w-full items-center gap-2">
      <Icon className="size-4 shrink-0" />
      <span className="truncate">{name}</span>
    </div>
  );
};
