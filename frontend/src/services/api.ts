import axios from "axios";

import type { AuthResponse, DashboardSummary, Paginated, Project, Task, User } from "../types/api";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000/api";

export const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const access = localStorage.getItem("accessToken");
  if (access) {
    config.headers.Authorization = `Bearer ${access}`;
  }
  return config;
});

export const authApi = {
  register: (payload: { full_name: string; email: string; password: string; confirm_password: string; role: "ADMIN" | "MEMBER" }) => {
    return api.post<AuthResponse>("/auth/signup", payload).then((res) => res.data);
  },
  login: (payload: { email: string; password: string }) => api.post<AuthResponse>("/auth/login", payload).then((res) => res.data),
  me: () => api.get<User>("/auth/me").then((res) => res.data),
  users: () => api.get<User[]>("/auth/users").then((res) => res.data),
  logout: (refresh: string | null) => api.post("/auth/logout", { refresh }),
};

export const dashboardApi = {
  summary: () => api.get<DashboardSummary>("/dashboard").then((res) => res.data),
};

export const projectsApi = {
  list: (params?: Record<string, string>) => api.get<Paginated<Project>>("/projects", { params }).then((res) => res.data),
  create: (payload: { title: string; description?: string; due_date?: string; status?: string; priority?: string; member_ids?: number[] }) => api.post<Project>("/projects", payload).then((res) => res.data),
  update: (id: number, payload: Partial<{ title: string; description: string; due_date: string; status: string; priority: string; member_ids: number[] }>) => api.put<Project>(`/projects/${id}`, payload).then((res) => res.data),
  delete: (id: number) => api.delete(`/projects/${id}`),
};

export const tasksApi = {
  list: (params?: Record<string, string>) => api.get<Paginated<Task>>("/tasks", { params }).then((res) => res.data),
  create: (payload: { title: string; description?: string; priority: string; status: string; due_date?: string; project_id: number; assigned_to_id?: number | null }) =>
    api.post<Task>("/tasks", payload).then((res) => res.data),
  update: (id: number, payload: Partial<{ title: string; description: string; priority: string; status: string; due_date: string; project_id: number; assigned_to_id: number | null }>) =>
    api.put<Task>(`/tasks/${id}`, payload).then((res) => res.data),
  delete: (id: number) => api.delete(`/tasks/${id}`),
};
