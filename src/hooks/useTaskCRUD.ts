import { useState, useCallback } from 'react';
import { taskService } from '../services/taskService';
import type { Task, CreateTaskRequest } from '../types';

export const useTaskCRUD = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const createTask = useCallback(async (taskData: CreateTaskRequest): Promise<Task | null> => {
    try {
      setIsLoading(true);
      setError('');
      const newTask = await taskService.createTask(taskData);
      return newTask;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear la tarea';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateTask = useCallback(async (taskId: number, updates: Partial<Task>): Promise<Task | null> => {
    try {
      setIsLoading(true);
      setError('');
      const updatedTask = await taskService.updateTask(taskId, updates);
      return updatedTask;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar la tarea';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const toggleTask = useCallback(async (taskId: number): Promise<Task | null> => {
    try {
      setIsLoading(true);
      setError('');
      const updatedTask = await taskService.toggleTask(taskId);
      return updatedTask;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cambiar estado de la tarea';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteTask = useCallback(async (taskId: number): Promise<void> => {
    try {
      setIsLoading(true);
      setError('');
      await taskService.deleteTask(taskId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar la tarea';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError('');
  }, []);

  return {
    // State
    isLoading,
    error,
    
    // Actions
    createTask,
    updateTask,
    toggleTask,
    deleteTask,
    clearError
  };
};