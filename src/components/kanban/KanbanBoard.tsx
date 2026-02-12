import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import KanbanColumn from "./KanbanColumn";
import TaskCard from "./TaskCard";
import TaskDialog from "./TaskDialog";
import AIChatPanel from "./AIChatPanel";
import { useTasks } from "@/hooks/useTasks";
import { COLUMNS, type ColumnId, type Task } from "@/types/task";
import { fireCelebration } from "@/lib/celebration";

export default function KanbanBoard() {
  const { tasks, isLoading, addTask, updateTask, deleteTask, moveTask } = useTasks();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [defaultColumn, setDefaultColumn] = useState<ColumnId>("todo");
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [chatOpen, setChatOpen] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const tasksByColumn = (colId: ColumnId) =>
    tasks.filter((t) => t.column_id === colId).sort((a, b) => a.position - b.position);

  const handleAddTask = (columnId: string) => {
    setEditingTask(null);
    setDefaultColumn(columnId as ColumnId);
    setDialogOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setDialogOpen(true);
  };

  const handleDeleteTask = (id: string) => {
    deleteTask.mutate(id);
  };

  const handleSave = (data: any) => {
    if (editingTask) {
      updateTask.mutate({ id: editingTask.id, ...data });
    } else {
      addTask.mutate(data);
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t.id === event.active.id);
    if (task) setActiveTask(task);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const draggedTask = activeTask;
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const overColumn = COLUMNS.find((c) => c.id === overId);
    const overTask = tasks.find((t) => t.id === overId);
    const targetColumnId = overColumn ? overColumn.id : overTask?.column_id;

    if (!targetColumnId) return;

    const activeTaskData = tasks.find((t) => t.id === activeId);
    if (!activeTaskData) return;

    // Check if column actually changed
    const columnChanged = activeTaskData.column_id !== targetColumnId;

    const colTasks = tasksByColumn(targetColumnId as ColumnId);
    let newPosition = colTasks.length;

    if (overTask) {
      const overIndex = colTasks.findIndex((t) => t.id === overId);
      newPosition = overIndex >= 0 ? overIndex : colTasks.length;
    }

    moveTask.mutate({ id: activeId, column_id: targetColumnId as ColumnId, position: newPosition });

    // 🎉 Celebrate when a task moves to a different column!
    if (columnChanged) {
      fireCelebration();
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="px-8 py-6 border-b border-border bg-card/80 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground tracking-tight">Tasks</h1>
              <p className="text-sm text-muted-foreground mt-0.5">Manage and organize your work</p>
            </div>
            <Button
              variant={chatOpen ? "default" : "outline"}
              size="sm"
              onClick={() => setChatOpen(!chatOpen)}
              className="gap-2"
            >
              <Sparkles className="h-4 w-4" />
              eilev
            </Button>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-5">
            {["Overview", "Board", "List", "Table", "Timeline"].map((tab) => (
              <button
                key={tab}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  tab === "Board"
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </header>

        {/* Board */}
        <div className="flex-1 overflow-x-auto p-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">Loading tasks...</div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCorners}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <div className="flex gap-6 h-full">
                {COLUMNS.map((col) => (
                  <KanbanColumn
                    key={col.id}
                    column={col}
                    tasks={tasksByColumn(col.id)}
                    onAddTask={handleAddTask}
                    onEditTask={handleEditTask}
                    onDeleteTask={handleDeleteTask}
                  />
                ))}
              </div>

              <DragOverlay>
                {activeTask && (
                  <div className="rotate-2 scale-105 shadow-2xl shadow-primary/20">
                    <TaskCard task={activeTask} onEdit={() => {}} onDelete={() => {}} />
                  </div>
                )}
              </DragOverlay>
            </DndContext>
          )}
        </div>
      </div>

      {/* AI Chat Panel */}
      <AIChatPanel open={chatOpen} onClose={() => setChatOpen(false)} tasks={tasks} />

      {/* Task Dialog */}
      <TaskDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        task={editingTask}
        defaultColumnId={defaultColumn}
        onSave={handleSave}
      />
    </div>
  );
}
