type Props = {
  icon: React.ComponentType<{ className?: string }>;
  name: string;
};

export const ColumnHeader = ({ icon: Icon, name }: Props) => {
  return (
    <div className="flex items-center gap-2">
      <Icon className="size-4" />
      <span>{name}</span>
    </div>
  );
};
