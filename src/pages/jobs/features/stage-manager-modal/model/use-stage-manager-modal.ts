import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { v4 as uuidv4 } from 'uuid';
import { $api } from '@/configs/api/client';
import { JOBS_QUERY_KEY, STAGES_QUERY_KEY } from '@/configs/api/query-keys';
import { useModalsStore } from '@/configs/zustand/modals/modals.store';
import { MODALS } from '@/configs/zustand/modals/modals.constants';

type NewStageData = {
  name: string;
  color: string;
};

type EditStageData = {
  name: string;
  color: string;
};

export const useStageManagerModal = () => {
  const queryClient = useQueryClient();
  const openModal = useModalsStore((state) => state.openModal);
  const { data: stages = [] } = $api.useQuery('get', '/api/jobs/stages');

  const createStage = $api.useMutation('post', '/api/jobs/stages', {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STAGES_QUERY_KEY });
    },
  });

  const updateStage = $api.useMutation('put', '/api/jobs/stages/{id}', {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STAGES_QUERY_KEY });
    },
  });

  const deleteStage = $api.useMutation('delete', '/api/jobs/stages/{id}', {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STAGES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: JOBS_QUERY_KEY });
    },
  });

  const [showAddForm, setShowAddForm] = useState(false);
  const [newStage, setNewStage] = useState<NewStageData>({
    name: '',
    color: '#3B82F6',
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<EditStageData>({
    name: '',
    color: '',
  });

  const handleShowAddForm = () => {
    setShowAddForm(true);
  };

  const handleCancelAdd = () => {
    setShowAddForm(false);
  };

  const handleNewStageChange = (field: keyof NewStageData, value: string) => {
    setNewStage((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddStage = () => {
    if (!newStage.name.trim()) return;

    createStage.mutate(
      {
        body: {
          id: uuidv4(),
          name: newStage.name.trim(),
          category: 'initial',
          position: stages.length,
        },
      },
      {
        onSuccess: () => {
          setNewStage({ name: '', color: '#3B82F6' });
          setShowAddForm(false);
        },
      }
    );
  };

  const handleStartEdit = (stage: {
    id: string;
    name: string;
    color: string;
  }) => {
    setEditingId(stage.id);
    setEditValue({ name: stage.name, color: stage.color });
  };

  const handleEditValueChange = (field: keyof EditStageData, value: string) => {
    setEditValue((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveEdit = () => {
    if (!editingId || !editValue.name.trim()) return;

    updateStage.mutate(
      {
        params: { path: { id: editingId } },
        body: { name: editValue.name.trim(), color: editValue.color },
      },
      {
        onSuccess: () => {
          setEditingId(null);
          setEditValue({ name: '', color: '' });
        },
      }
    );
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditValue({ name: '', color: '' });
  };

  const handleDeleteStage = (stageId: string) => {
    const stage = stages.find((s) => s.id === stageId);

    if (!stage) return;

    openModal(MODALS.Confirm, {
      title: 'Delete Stage',
      description: `Are you sure you want to delete "${stage.name}"? Jobs in this stage will be moved to the default stage.`,
      confirmLabel: 'Delete',
      variant: 'destructive',
      onConfirm: () => {
        deleteStage.mutate({ params: { path: { id: stageId } } });
      },
    });
  };

  return {
    stages,
    showAddForm,
    newStage,
    editingId,
    editValue,
    isCreating: createStage.isPending,
    handleShowAddForm,
    handleCancelAdd,
    handleNewStageChange,
    handleAddStage,
    handleStartEdit,
    handleEditValueChange,
    handleSaveEdit,
    handleCancelEdit,
    handleDeleteStage,
  };
};
