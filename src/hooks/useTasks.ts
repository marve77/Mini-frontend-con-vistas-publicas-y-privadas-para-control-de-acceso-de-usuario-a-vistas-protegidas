import { useState, useEffect } from 'react';
import { taskService } from '../services/taskService';
import type { Task, CreateTaskRequest } from '../types';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setError('');
      const fetchedTasks = await taskService.getTasks();
      setTasks(fetchedTasks);
    } catch (err: any) {
      setError('Error al cargar las tareas');
      console.error('Error loading tasks:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const createTask = async (taskData: CreateTaskRequest): Promise<Task | null> => {
    try {
      setError('');
      const createdTask = await taskService.createTask(taskData);
      setTasks(prev => [createdTask, ...prev]);
      return createdTask;
    } catch (err: any) {
      setError('Error al crear la tarea');
      console.error('Error creating task:', err);
      return null;
    }
  };

  const toggleTask = async (taskId: number): Promise<Task | null> => {
    try {
      setError('');
      const updatedTask = await taskService.toggleTask(taskId);
      setTasks(prev => prev.map(task => 
        task.id === taskId ? updatedTask : task
      ));
      return updatedTask;
    } catch (err: any) {
      setError('Error al actualizar la tarea');
      console.error('Error toggling task:', err);
      return null;
    }
  };

  const deleteTask = async (taskId: number): Promise<boolean> => {
    try {
      setError('');
      await taskService.deleteTask(taskId);
      setTasks(prev => prev.filter(task => task.id !== taskId));
      return true;
    } catch (err: any) {
      setError('Error al eliminar la tarea');
      console.error('Error deleting task:', err);
      return false;
    }
  };

  const clearError = () => setError('');

  // Computed values
  const completedTasks = tasks.filter(task => task.done);
  const pendingTasks = tasks.filter(task => !task.done);
  const tasksStats = {
    total: tasks.length,
    completed: completedTasks.length,
    pending: pendingTasks.length,
    completionRate: tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0
  };

  return {
    // State
    tasks,
    loading: isLoading,
    error,
    
    // Actions
    loadTasks,
    createTask,
    toggleTask,
    deleteTask,
    clearError,
    
    // Computed
    completedTasks,
    pendingTasks,
    stats: tasksStats
  };
};