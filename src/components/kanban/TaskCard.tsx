import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MoreHorizontal, Flag, MessageSquare, Link2, ListChecks } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Task } from "@/types/task";
import { STATUS_LABELS, STATUS_COLORS } from "@/types/task";
import { format } from "date-fns";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

const priorityStyles: Record<string, string> = {
  low: "bg-[hsl(var(--priority-low)/0.12)] text-[hsl(var(--priority-low))]",
  medium: "bg-[hsl(var(--priority-medium)/0.12)] text-[hsl(var(--priority-medium))]",
  high: "bg-[hsl(var(--priority-high)/0.12)] text-[hsl(var(--priority-high))]",
};

export default function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: { type: "task", task },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-card rounded-xl border border-border/60 p-4 shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing space-y-3"
    >
      {/* Status + Menu */}
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: STATUS_COLORS[task.status] }}
          />
          {STATUS_LABELS[task.status]}
        </span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => e.stopPropagation()}>
              <MoreHorizontal className="h-3.5 w-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(task)}>Edit</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive" onClick={() => onDelete(task.id)}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Title & Description */}
      <div>
        <h4 className="font-semibold text-sm text-foreground leading-snug">{task.title}</h4>
        {task.description && (
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{task.description}</p>
        )}
      </div>

      {/* Assignees */}
      {task.assignees.length > 0 && (
        <div className="flex -space-x-1.5">
          {task.assignees.slice(0, 3).map((a, i) => (
            <div
              key={i}
              className="h-6 w-6 rounded-full bg-primary/20 border-2 border-card flex items-center justify-center text-[10px] font-bold text-primary"
            >
              {a[0]?.toUpperCase()}
            </div>
          ))}
          {task.assignees.length > 3 && (
            <div className="h-6 w-6 rounded-full bg-muted border-2 border-card flex items-center justify-center text-[10px] font-medium text-muted-foreground">
              +{task.assignees.length - 3}
            </div>
          )}
        </div>
      )}

      {/* Due date + Priority */}
      <div className="flex items-center justify-between">
        {task.due_date ? (
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <Flag className="h-3 w-3" />
            {format(new Date(task.due_date), "MMM d")}
          </span>
        ) : (
          <span />
        )}
        <Badge className={`text-[10px] px-2 py-0.5 font-semibold border-0 ${priorityStyles[task.priority]}`}>
          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
        </Badge>
      </div>

      {/* Footer stats */}
      {(task.comments_count > 0 || task.links_count > 0 || task.subtasks_total > 0) && (
        <div className="flex items-center gap-3 pt-1 border-t border-border/40">
          {task.comments_count > 0 && (
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <MessageSquare className="h-3 w-3" /> {task.comments_count}
            </span>
          )}
          {task.links_count > 0 && (
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <Link2 className="h-3 w-3" /> {task.links_count}
            </span>
          )}
          {task.subtasks_total > 0 && (
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <ListChecks className="h-3 w-3" /> {task.subtasks_done}/{task.subtasks_total}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
