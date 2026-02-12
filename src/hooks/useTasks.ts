import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Task, ColumnId, Priority, TaskStatus } from "@/types/task";

export function useTasks() {
  const queryClient = useQueryClient();

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .order("position", { ascending: true });
      if (error) throw error;
      return data as Task[];
    },
  });

  const addTask = useMutation({
    mutationFn: async (task: {
      title: string;
      description?: string;
      column_id: ColumnId;
      priority?: Priority;
      status?: TaskStatus;
      due_date?: string | null;
    }) => {
      const maxPos = tasks
        .filter((t) => t.column_id === task.column_id)
        .reduce((max, t) => Math.max(max, t.position), -1);
      const { data, error } = await supabase
        .from("tasks")
        .insert({ ...task, position: maxPos + 1 })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });

  const updateTask = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Task> & { id: string }) => {
      const { error } = await supabase.from("tasks").update(updates).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });

  const deleteTask = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("tasks").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });

  const moveTask = useMutation({
    mutationFn: async ({ id, column_id, position }: { id: string; column_id: ColumnId; position: number }) => {
      const statusMap: Record<ColumnId, TaskStatus> = {
        todo: "not_started",
        in_progress: "on_track",
        done: "complete",
      };
      const { error } = await supabase
        .from("tasks")
        .update({ column_id, position, status: statusMap[column_id] })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });

  return { tasks, isLoading, addTask, updateTask, deleteTask, moveTask };
}
