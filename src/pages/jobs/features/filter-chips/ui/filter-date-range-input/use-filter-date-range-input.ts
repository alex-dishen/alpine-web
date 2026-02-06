import { useState } from 'react';
import {
  parseDate,
  formatToISO,
} from '@/pages/jobs/features/filter-chips/registry/date-utils';

type UseFilterDateRangeInputProps = {
  value: string[];
  onChange: (value: string[]) => void;
};

export const useFilterDateRangeInput = ({
  value,
  onChange,
}: UseFilterDateRangeInputProps) => {
  const startDate = value?.[0] ?? '';
  const endDate = value?.[1] ?? '';

  const [activeField, setActiveField] = useState<'start' | 'end'>('start');
  const [hoveredDate, setHoveredDate] = useState<Date | undefined>();

  const startDateObj = parseDate(startDate);
  const endDateObj = parseDate(endDate);

  const handleCalendarSelect = (date: Date | undefined) => {
    if (!date) return;

    const formatted = formatToISO(date);

    if (activeField === 'start') {
      onChange([formatted, endDate]);
      setActiveField('end');
    } else {
      onChange([startDate, formatted]);
    }
  };

  const handleClearStart = () => {
    onChange(['', endDate]);
    setActiveField('start');
  };

  const handleClearEnd = () => {
    onChange([startDate, '']);
    setActiveField('end');
  };

  const getDisabledDates = () => {
    if (activeField === 'start' && endDateObj) {
      return { after: endDateObj };
    }

    if (activeField === 'end' && startDateObj) {
      return { before: startDateObj };
    }

    return undefined;
  };

  const getModifiers = () => {
    let effectiveStart = startDateObj;
    let effectiveEnd = endDateObj;

    if (hoveredDate) {
      if (activeField === 'end' && startDateObj && !endDateObj) {
        if (hoveredDate >= startDateObj) {
          effectiveEnd = hoveredDate;
        }
      } else if (activeField === 'start' && endDateObj && !startDateObj) {
        if (hoveredDate <= endDateObj) {
          effectiveStart = hoveredDate;
        }
      }
    }

    return {
      range_start: effectiveStart ? [effectiveStart] : [],
      range_end: effectiveEnd ? [effectiveEnd] : [],
      range_middle:
        effectiveStart && effectiveEnd && effectiveStart < effectiveEnd
          ? [{ after: effectiveStart, before: effectiveEnd }]
          : [],
    };
  };

  return {
    startDate,
    endDate,
    startDateObj,
    endDateObj,
    activeField,
    setActiveField,
    setHoveredDate,
    handleCalendarSelect,
    handleClearStart,
    handleClearEnd,
    getDisabledDates,
    getModifiers,
  };
};
