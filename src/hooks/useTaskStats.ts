import { useMemo } from 'react';
import type { Task } from '../types';

interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  completionRate: number;
}

export const useTaskStats = (tasks: Task[]): TaskStats => {
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.done).length;
    const pending = total - completed;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      total,
      completed,
      pending,
      completionRate
    };
  }, [tasks]);

  return stats;
};