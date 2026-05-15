export function userDto(user) {
  if (!user) return null;
  return {
    id: user.id,
    fullName: user.fullName,
    full_name: user.fullName,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    created_at: user.createdAt
  };
}

export function isOverdue(date, status) {
  return Boolean(date && new Date(date) < new Date() && status !== "COMPLETED");
}

export function projectDto(project) {
  const tasks = project.tasks ?? [];
  const completed = tasks.filter((task) => task.status === "COMPLETED").length;
  const progress = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;
  return {
    id: project.id,
    title: project.title,
    description: project.description ?? "",
    deadline: project.deadline,
    due_date: project.deadline,
    status: project.status,
    priority: project.priority,
    createdBy: userDto(project.createdBy),
    created_by: userDto(project.createdBy),
    members: (project.members ?? []).map((member) => userDto(member.user)),
    taskCount: tasks.length,
    task_count: tasks.length,
    completedTaskCount: completed,
    completed_task_count: completed,
    progress,
    createdAt: project.createdAt,
    created_at: project.createdAt,
    updatedAt: project.updatedAt,
    updated_at: project.updatedAt
  };
}

export function taskDto(task) {
  return {
    id: task.id,
    title: task.title,
    description: task.description ?? "",
    priority: task.priority,
    status: task.status,
    dueDate: task.dueDate,
    due_date: task.dueDate,
    assignee: userDto(task.assignee),
    assigned_to: userDto(task.assignee),
    projectId: task.projectId,
    project_id: task.projectId,
    projectTitle: task.project?.title,
    project_title: task.project?.title,
    isOverdue: isOverdue(task.dueDate, task.status),
    is_overdue: isOverdue(task.dueDate, task.status),
    createdAt: task.createdAt,
    created_at: task.createdAt,
    updatedAt: task.updatedAt,
    updated_at: task.updatedAt
  };
}
