import { useState, useEffect, useCallback } from 'react';
import { taskService } from '../services/taskService';
import type { Task } from '../types';

export const useTaskState = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  const loadTasks = useCallback(async () => {
    try {
      setIsLoading(true);
      setError('');
      const fetchedTasks = await taskService.getTasks();
      setTasks(fetchedTasks);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar las tareas';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addTask = useCallback((newTask: Task) => {
    setTasks(prev => [newTask, ...prev]);
  }, []);

  const updateTaskInList = useCallback((taskId: number, updatedTask: Task) => {
    setTasks(prev => 
      prev.map(task => task.id === taskId ? updatedTask : task)
    );
  }, []);

  const removeTask = useCallback((taskId: number) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  }, []);

  const clearError = useCallback(() => {
    setError('');
  }, []);

  // Cargar tareas al montar el componente
  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  return {
    // State
    tasks,
    isLoading,
    error,
    
    // Actions
    loadTasks,
    addTask,
    updateTaskInList,
    removeTask,
    clearError
  };
};