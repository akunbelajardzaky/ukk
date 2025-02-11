"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { format, addDays, subDays, addWeeks, subWeeks, addMonths, subMonths, addYears, subYears } from "date-fns"
import { useTasks, type Task } from "@/hooks/use-task"
import { ChevronLeft, ChevronRight, Calendar, CheckCircle, Circle, AlertCircle } from 'lucide-react'

type ViewType = "day" | "week" | "month" | "year" | "today"

export default function TaskManager() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<ViewType>("day")
  const formattedDate = format(currentDate, "yyyy-MM-dd")
  const { tasks, loading } = useTasks(currentDate)

  useEffect(() => {
    console.log("Formatted Date:", formattedDate)
  }, [formattedDate])

  const handleNext = () => {
    setCurrentDate((prev) => {
      switch (view) {
        case "day":
          return addDays(prev, 1)
        case "week":
          return addWeeks(prev, 1)
        case "month":
          return addMonths(prev, 1)
        case "year":
          return addYears(prev, 1)
        default:
          return prev
      }
    })
  }

  const handlePrevious = () => {
    setCurrentDate((prev) => {
      switch (view) {
        case "day":
          return subDays(prev, 1)
        case "week":
          return subWeeks(prev, 1)
        case "month":
          return subMonths(prev, 1)
        case "year":
          return subYears(prev, 1)
        default:
          return prev
      }
    })
  }

  const handleViewChange = (newView: ViewType) => {
    setView(newView)
    if (newView === "today") {
      setCurrentDate(new Date())
    }
  }

  const formattedDisplayDate = format(currentDate, "MMM dd, yyyy")
  const dayOfWeek = format(currentDate, "EEEE")

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 min-h-screen text-white flex flex-col items-center justify-center p-4 md:p-8">
      <motion.div
        className="w-full max-w-7xl bg-gray-800 rounded-xl shadow-2xl overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col md:flex-row h-[700px]">
          <div className="bg-gray-900 p-6 md:w-1/4">
            <h1 className="text-3xl font-bold mb-6 text-center">Quickly</h1>
            <nav className="space-y-2">
              {(["today", "day", "week", "month", "year"] as ViewType[]).map((v) => (
                <button
                  key={v}
                  className={`w-full text-left py-2 px-4 rounded transition-colors flex items-center ${
                    view === v ? "bg-gray-700 text-white" : "text-gray-400 hover:bg-gray-800"
                  }`}
                  onClick={() => handleViewChange(v)}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {v.charAt(0).toUpperCase() + v.slice(1)}
                </button>
              ))}
            </nav>
          </div>
          <div className="md:w-3/4 p-6 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <button 
                onClick={handlePrevious}
                className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <div className="text-center">
                <h2 className="text-2xl font-bold">{dayOfWeek}</h2>
                <p className="text-gray-400">{formattedDisplayDate}</p>
              </div>
              <button 
                onClick={handleNext}
                className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>
            <motion.div
              className="space-y-4 flex-grow overflow-y-auto pr-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ staggerChildren: 0.1 }}
            >
              {loading ? (
                <p className="text-center">Loading tasks...</p>
              ) : tasks.length === 0 ? (
                <p className="text-center text-gray-500">No tasks for this day</p>
              ) : (
                <AnimatePresence>
                  {tasks.map((task) => (
                    <TaskItem key={task.id} task={task} />
                  ))}
                </AnimatePresence>
              )}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

const TaskItem = ({ task }: { task: Task }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.2 }}
    className="bg-gray-700 rounded-lg shadow-lg p-4"
  >
    <div className="flex items-start justify-between">
      <div className="flex items-start space-x-3">
        {task.status === "COMPLETED" ? (
          <CheckCircle className="h-5 w-5 text-green-500" />
        ) : (
          <Circle className="h-5 w-5 text-gray-400" />
        )}
        <div>
          <p className="font-semibold">{task.text}</p>
          {task.description && <p className="text-sm text-gray-400 mt-1">{task.description}</p>}
        </div>
      </div>
      <PriorityBadge priority={task.priority} />
    </div>
    <div className="mt-3 flex items-center space-x-2 text-sm text-gray-400">
      <span className="px-2 py-1 bg-gray-600 rounded-full text-xs">{task.status}</span>
      <span>{format(new Date(task.date), "MMM d, yyyy")}</span>
    </div>
  </motion.div>
)

const PriorityBadge = ({ priority }: { priority: string }) => {
  let color = "bg-gray-500"
  if (priority === "HIGH") color = "bg-red-500"
  if (priority === "MEDIUM") color = "bg-yellow-500"
  if (priority === "LOW") color = "bg-green-500"

  return (
    <div className={`flex items-center ${color} text-white text-xs font-bold px-2 py-1 rounded-full`}>
      <AlertCircle className="h-3 w-3 mr-1" />
      {priority}
    </div>
  )
}
