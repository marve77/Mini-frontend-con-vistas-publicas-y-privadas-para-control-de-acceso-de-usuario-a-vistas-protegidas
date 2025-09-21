export interface User {
  id: number;
  email: string;
  name?: string;
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  done: boolean;
  createdAt: string;
  updatedAt: string;
  userId: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name?: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  done?: boolean;
}