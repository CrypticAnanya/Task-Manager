export type UserRole = "ADMIN" | "MEMBER";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";
export type TaskStatus = "TODO" | "IN_PROGRESS" | "REVIEW" | "COMPLETED";
export type ProjectStatus = "PLANNING" | "ACTIVE" | "ON_HOLD" | "COMPLETED";

export interface User {
  id: number;
  fullName: string;
  full_name: string;
  email: string;
  role: UserRole;
  created_at?: string;
}

export interface AuthResponse {
  user: User;
  access: string;
  token?: string;
  refresh: string;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  deadline: string | null;
  due_date: string | null;
  status: ProjectStatus;
  priority: TaskPriority;
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
  priority: TaskPriority;
  status: TaskStatus;
  due_date: string | null;
  assigned_to: User | null;
  project_title: string;
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
  priority_counts: Record<TaskPriority, number>;
  project_progress: Array<{ name: string; progress: number; tasks: number }>;
  recent_activity: Array<{ id: number; title: string; project: string; status: TaskStatus; assigned_to: string; updated_at: string }>;
  my_tasks: Task[];
}

export interface Paginated<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
