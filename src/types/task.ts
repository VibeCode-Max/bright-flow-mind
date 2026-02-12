export type ColumnId = "todo" | "in_progress" | "done";
export type Priority = "low" | "medium" | "high";
export type TaskStatus = "not_started" | "in_research" | "on_track" | "complete";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  column_id: ColumnId;
  priority: Priority;
  due_date: string | null;
  assignees: string[];
  comments_count: number;
  links_count: number;
  subtasks_done: number;
  subtasks_total: number;
  position: number;
  created_at: string;
  updated_at: string;
}

export interface Column {
  id: ColumnId;
  title: string;
  color: string;
}

export const COLUMNS: Column[] = [
  { id: "todo", title: "To Do", color: "hsl(var(--kanban-todo))" },
  { id: "in_progress", title: "In Progress", color: "hsl(var(--kanban-progress))" },
  { id: "done", title: "Done", color: "hsl(var(--kanban-done))" },
];

export const STATUS_LABELS: Record<TaskStatus, string> = {
  not_started: "Not Started",
  in_research: "In Research",
  on_track: "On Track",
  complete: "Complete",
};

export const STATUS_COLORS: Record<TaskStatus, string> = {
  not_started: "hsl(var(--muted-foreground))",
  in_research: "hsl(var(--kanban-todo))",
  on_track: "hsl(var(--kanban-progress))",
  complete: "hsl(var(--kanban-done))",
};
