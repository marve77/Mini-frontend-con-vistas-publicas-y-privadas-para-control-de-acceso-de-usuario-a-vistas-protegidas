import { useCallback } from 'react';
import { useTaskState } from './useTaskState';
import { useTaskCRUD } from './useTaskCRUD';
import { useTaskStats } from './useTaskStats';
import type { CreateTaskRequest } from '../types';

export const useTaskManager = () => {
  const {
    tasks,
    isLoading: stateLoading,
    error: stateError,
    loadTasks,
    addTask,
    updateTaskInList,
    removeTask,
    clearError: clearStateError
  } = useTaskState();

  const {
    isLoading: crudLoading,
    error: crudError,
    createTask: createTaskAPI,
    toggleTask: toggleTaskAPI,
    deleteTask: deleteTaskAPI,
    clearError: clearCrudError
  } = useTaskCRUD();

  const stats = useTaskStats(tasks);

  // Operaciones combinadas que actualizan tanto la API como el estado local
  const createTask = useCallback(async (taskData: CreateTaskRequest) => {
    const newTask = await createTaskAPI(taskData);
    if (newTask) {
      addTask(newTask);
    }
    return newTask;
  }, [createTaskAPI, addTask]);

  const toggleTask = useCallback(async (taskId: number) => {
    const updatedTask = await toggleTaskAPI(taskId);
    if (updatedTask) {
      updateTaskInList(taskId, updatedTask);
    }
    return updatedTask;
  }, [toggleTaskAPI, updateTaskInList]);

  const deleteTask = useCallback(async (taskId: number) => {
    await deleteTaskAPI(taskId);
    removeTask(taskId);
  }, [deleteTaskAPI, removeTask]);

  const clearAllErrors = useCallback(() => {
    clearStateError();
    clearCrudError();
  }, [clearStateError, clearCrudError]);

  return {
    // State
    tasks,
    loading: stateLoading || crudLoading,
    error: stateError || crudError,
    stats,
    
    // Actions
    loadTasks,
    createTask,
    toggleTask,
    deleteTask,
    clearError: clearAllErrors
  };
};