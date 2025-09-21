import api from './api';
import type { Task, CreateTaskRequest, UpdateTaskRequest } from '../types';

export const taskService = {
  async getTasks(): Promise<Task[]> {
    const response = await api.get('/tasks');
    return response.data;
  },

  async createTask(taskData: CreateTaskRequest): Promise<Task> {
    const response = await api.post('/tasks', taskData);
    return response.data;
  },

  async updateTask(id: number, taskData: UpdateTaskRequest): Promise<Task> {
    const response = await api.patch(`/tasks/${id}`, taskData);
    return response.data;
  },

  async deleteTask(id: number): Promise<void> {
    await api.delete(`/tasks/${id}`);
  },

  async toggleTask(id: number): Promise<Task> {
    const response = await api.patch(`/tasks/${id}/toggle`);
    return response.data;
  }
};