import { COLUMN_TYPES, type ColumnType } from '@/configs/api/types/api.enums';
import type { JobColumn } from '@/pages/jobs/registry/jobs.types';
import {
  AlignLeft,
  CalendarIcon,
  CheckSquare,
  CircleChevronDown,
  Hash,
  Link,
  List,
} from 'lucide-react';

export const formatColumnValue = (
  column: JobColumn,
  value: unknown
): Record<string, unknown> => {
  switch (column.column_type) {
    case COLUMN_TYPES.SELECT:
      return { option_id: value };
    case COLUMN_TYPES.MULTI_SELECT:
      return { option_ids: value };
    case COLUMN_TYPES.CHECKBOX:
      return { text_value: value ? 'true' : 'false' };
    default:
      return { text_value: value };
  }
};

export const getIconForColumnType = (columnType: ColumnType) => {
  switch (columnType) {
    case COLUMN_TYPES.TEXT:
      return AlignLeft;
    case COLUMN_TYPES.NUMBER:
      return Hash;
    case COLUMN_TYPES.DATE:
      return CalendarIcon;
    case COLUMN_TYPES.URL:
      return Link;
    case COLUMN_TYPES.CHECKBOX:
      return CheckSquare;
    case COLUMN_TYPES.SELECT:
      return CircleChevronDown;
    case COLUMN_TYPES.MULTI_SELECT:
      return List;
    default:
      return AlignLeft;
  }
};
