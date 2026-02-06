import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { arrayMove } from '@dnd-kit/sortable';
import type { DragEndEvent } from '@dnd-kit/core';
import { $api } from '@/configs/api/client';
import { useModalsStore } from '@/configs/zustand/modals/modals.store';
import { MODALS } from '@/configs/zustand/modals/modals.constants';
import { COLUMN_TYPES, type ColumnType } from '@/configs/api/types/api.enums';
import { useJobsTableStore } from '@/configs/zustand/jobs-table/jobs-table.store';
import { useCreateColumn } from '@/pages/jobs/model/use-create-column';
import { useUpdateColumn } from '@/pages/jobs/model/use-update-column';
import { useDeleteColumn } from '@/pages/jobs/model/use-delete-column';

type NewColumnData = {
  name: string;
  column_type: ColumnType;
};

export const useColumnManagerModal = () => {
  const openModal = useModalsStore((state) => state.openModal);
  const columnOrder = useJobsTableStore((state) => state.columnOrder);
  const setColumnOrder = useJobsTableStore((state) => state.setColumnOrder);
  const { data: columns = [] } = $api.useQuery('get', '/api/jobs/columns');

  const createColumn = useCreateColumn();
  const updateColumn = useUpdateColumn();
  const deleteColumn = useDeleteColumn();

  const [showAddForm, setShowAddForm] = useState(false);
  const [newColumn, setNewColumn] = useState<NewColumnData>({
    name: '',
    column_type: COLUMN_TYPES.TEXT,
  });

  const handleToggleAddForm = () => {
    setShowAddForm((prev) => !prev);
  };

  const handleCancelAdd = () => {
    setShowAddForm(false);
  };

  const handleNewColumnChange = (field: keyof NewColumnData, value: string) => {
    setNewColumn((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddColumn = () => {
    if (!newColumn.name.trim()) return;

    createColumn.mutate(
      {
        body: {
          id: uuidv4(),
          name: newColumn.name.trim(),
          column_type: newColumn.column_type,
        },
      },
      {
        onSuccess: () => {
          setNewColumn({ name: '', column_type: COLUMN_TYPES.TEXT });
          setShowAddForm(false);
        },
      }
    );
  };

  const handleDeleteColumn = (columnId: string) => {
    openModal(MODALS.Confirm, {
      title: 'Delete Column',
      description:
        'Are you sure you want to delete this column? This action cannot be undone.',
      confirmLabel: 'Delete',
      variant: 'destructive',
      onConfirm: () => {
        deleteColumn.mutate({ params: { path: { id: columnId } } });
      },
    });
  };

  const handleRenameColumn = (columnId: string, newName: string) => {
    if (!newName.trim()) return;

    updateColumn.mutate({
      params: { path: { id: columnId } },
      body: { name: newName.trim() },
    });
  };

  // Sort columns to match the persisted column order from the table store
  const sortedColumns = [...columns].sort((a, b) => {
    const indexA = columnOrder.indexOf(a.id);
    const indexB = columnOrder.indexOf(b.id);

    // Columns not in columnOrder go to the end
    if (indexA === -1 && indexB === -1) return 0;

    if (indexA === -1) return 1;

    if (indexB === -1) return -1;

    return indexA - indexB;
  });

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (over && active.id !== over.id) {
        setColumnOrder((current) => {
          const oldIndex = current.indexOf(active.id as string);
          const newIndex = current.indexOf(over.id as string);

          return arrayMove(current, oldIndex, newIndex);
        });
      }
    },
    [setColumnOrder]
  );

  return {
    sortedColumns,
    columnOrder,
    showAddForm,
    newColumn,
    isCreating: createColumn.isPending,
    handleToggleAddForm,
    handleCancelAdd,
    handleNewColumnChange,
    handleAddColumn,
    handleRenameColumn,
    handleDeleteColumn,
    handleDragEnd,
  };
};
