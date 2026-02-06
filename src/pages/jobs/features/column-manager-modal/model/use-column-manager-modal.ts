import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { v4 as uuidv4 } from 'uuid';
import { $api } from '@/configs/api/client';
import { COLUMNS_QUERY_KEY, JOBS_QUERY_KEY } from '@/configs/api/query-keys';
import { useModalsStore } from '@/configs/zustand/modals/modals.store';
import { MODALS } from '@/configs/zustand/modals/modals.constants';
import { COLUMN_TYPES, type ColumnType } from '@/configs/api/types/api.enums';

type NewColumnData = {
  name: string;
  column_type: ColumnType;
};

export const useColumnManagerModal = () => {
  const queryClient = useQueryClient();
  const openModal = useModalsStore((state) => state.openModal);
  const { data: columns = [] } = $api.useQuery('get', '/api/jobs/columns');

  const createColumn = $api.useMutation('post', '/api/jobs/columns', {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COLUMNS_QUERY_KEY });
    },
  });

  const deleteColumn = $api.useMutation('delete', '/api/jobs/columns/{id}', {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COLUMNS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: JOBS_QUERY_KEY });
    },
  });

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

  return {
    columns,
    showAddForm,
    newColumn,
    isCreating: createColumn.isPending,
    handleToggleAddForm,
    handleCancelAdd,
    handleNewColumnChange,
    handleAddColumn,
    handleDeleteColumn,
  };
};
