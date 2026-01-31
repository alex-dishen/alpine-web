import { SYSTEM_COLUMN_NAMES } from '@/pages/jobs/registry/jobs.constants';

export const SystemColumnsInfo = () => {
  return (
    <div>
      <h4 className="mb-2 text-sm font-medium">System Columns</h4>
      <p className="text-muted-foreground mb-2 text-xs">
        These columns are always available: {SYSTEM_COLUMN_NAMES.join(', ')}
      </p>
    </div>
  );
};
