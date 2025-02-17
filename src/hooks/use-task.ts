import { useState, useEffect, useCallback } from "react";
import { getAllTasks } from "@/query/task";
import { ViewType } from "@/app/(proteced)/page"; // Import ViewType from TaskManager

export interface Task {
  id: number;
  text: string;
  description: string;
  priority: string;
  status: string;
  date: string;
  createdAt: string;
}

export function useTasks(date: Date, view: ViewType) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    const filteredTasks = await getAllTasks(date, view);
    const mappedTasks = filteredTasks.map(task => ({
      ...task,
      date: new Date(task.date).toISOString().split('T')[0], // Ensure date is a string
      description: task.description || "",
      createdAt: new Date(task.createdAt).toISOString(), // Convert createdAt to string
    }));
    setTasks(mappedTasks);
    setLoading(false);
  }, [date, view]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return { tasks, loading, refetch: fetchTasks };
}