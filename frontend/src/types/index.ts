export type Role = "ADMIN" | "MEMBER";
export type Priority = "LOW" | "MEDIUM" | "HIGH";
export type TaskStatus = "TODO" | "IN_PROGRESS" | "REVIEW" | "DONE";

export interface User {
  id: number;
  full_name: string;
  email: string;
  role: Role;
  created_at?: string;
}

export interface AuthResponse {
  user: User;
  access: string;
  refresh: string;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  due_date: string | null;
  created_by: User;
  members: User[];
  task_count: number;
  completed_task_count: number;
  progress: number;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  priority: Priority;
  status: TaskStatus;
  due_date: string | null;
  assigned_to: User | null;
  project_title: string;
  created_by: User;
  is_overdue: boolean;
  created_at: string;
  updated_at: string;
}

export interface DashboardSummary {
  total_projects: number;
  total_tasks: number;
  completed_tasks: number;
  overdue_tasks: number;
  completion_rate: number;
  status_counts: Record<TaskStatus, number>;
  priority_counts: Record<Priority, number>;
  project_progress: { name: string; progress: number; tasks: number }[];
  recent_activity: Task[];
}

export interface Paginated<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
