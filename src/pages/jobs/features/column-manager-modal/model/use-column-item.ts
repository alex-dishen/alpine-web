import { useState, useEffect, useRef, useCallback } from 'react';
import { useSortable } from '@dnd-kit/sortable';

type UseColumnItemOptions = {
  id: string;
  name: string;
  isCore: boolean;
  onRename: (id: string, newName: string) => void;
};

export const useColumnItem = ({
  id,
  name,
  isCore,
  onRename,
}: UseColumnItemOptions) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(name);
  const editAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setEditValue(name);
  }, [name]);

  const handleCancel = useCallback(() => {
    setEditValue(name);
    setIsEditing(false);
  }, [name]);

  useEffect(() => {
    if (!isEditing) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        editAreaRef.current &&
        !editAreaRef.current.contains(e.target as Node)
      ) {
        handleCancel();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isEditing, handleCancel]);

  const {
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
    setNodeRef,
  } = useSortable({ id });

  const style = {
    transform: transform ? `translate3d(0, ${transform.y}px, 0)` : undefined,
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleSave = () => {
    const trimmed = editValue.trim();

    if (trimmed && trimmed !== name) {
      onRename(id, trimmed);
    }

    setIsEditing(false);
  };

  const startEditing = () => {
    if (!isCore) setIsEditing(true);
  };

  return {
    style,
    isEditing,
    editValue,
    editAreaRef,
    attributes,
    listeners,
    setNodeRef,
    setEditValue,
    handleSave,
    handleCancel,
    startEditing,
  };
};
