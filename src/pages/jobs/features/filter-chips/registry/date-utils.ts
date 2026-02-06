import { format, parse, isValid } from 'date-fns';

export const parseDate = (dateStr: string): Date | undefined => {
  if (!dateStr) return undefined;
  const normalized = dateStr.replace(/\//g, '-');
  const date = parse(normalized, 'yyyy-MM-dd', new Date());

  return isValid(date) ? date : undefined;
};

export const formatForDisplay = (dateStr: string): string => {
  if (!dateStr) return '';
  const date = parseDate(dateStr);

  return date ? format(date, 'yyyy/MM/dd') : dateStr;
};

export const formatToISO = (date: Date): string => {
  return format(date, 'yyyy-MM-dd');
};
