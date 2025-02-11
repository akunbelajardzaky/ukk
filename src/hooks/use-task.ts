import { useState, useEffect } from "react"
import { getAllTasks } from "@/query/task"
import { format } from "date-fns"

export interface Task {
  id: number
  text: string
  description: string
  priority: string
  status: string
  date: string
  createdAt: string
  updatedAt: string
}

export function useTasks(date: Date) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      const allTasks = await getAllTasks()
      console.log("All Tasks:", allTasks)
      console.log(date)
      const filteredTasks = allTasks
        .filter(task => {
          const taskDate = new Date(task.date).toISOString().split('T')[0]
          const filterDate = date.toISOString().split('T')[0]
          return taskDate === filterDate
        })
        .map(task => ({
          ...task,
          date: new Date(task.date).toISOString().split('T')[0], // Ensure date is a string
          description: task.description || "",
          createdAt: new Date(task.createdAt).toISOString(), // Convert createdAt to string
          updatedAt: new Date(task.updatedAt).toISOString()  // Convert updatedAt to string
        }))
      console.log("Filtered Tasks:", filteredTasks)
      setTasks(filteredTasks)
      setLoading(false)
    }
    fetchData()
  }, [date])

  return { tasks, loading }
}