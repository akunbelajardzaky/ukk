"use client"
import { useState, useEffect } from "react"
import type React from "react"

import { motion, AnimatePresence } from "framer-motion"
import {
  format,
  addDays,
  subDays,
  startOfWeek,
  startOfMonth,
  startOfYear,
  addMonths,
  addYears,
  subMonths,
  subYears,
} from "date-fns"
import { Calendar, ChevronLeft, ChevronRight, CheckCircle, Circle, AlertCircle, PlusCircleIcon } from "lucide-react"
import { useTasks } from "@/hooks/use-task"
import clsx from "clsx"
import DatePicker from "react-datepicker"
import Select from "react-select"
import "react-datepicker/dist/react-datepicker.css"
import { createTask, deleteTask, updateTask, updateTaskStatus } from "@/action/create"

export type ViewType = "day" | "week" | "month" | "year" | "today"

// ModalButton Component to trigger modal open
interface IModalButtonProps {
  openModal: () => void
}

const ModalButton: React.FC<IModalButtonProps> = ({ openModal }) => (
  <button
    className={clsx(
      "w-full text-left py-3 px-4 rounded-xl transition-all duration-200 flex items-center bg-gray-900 text-white shadow-lg dark:bg-white dark:text-gray-900 ",
    )}
    onClick={openModal}
  >
    <PlusCircleIcon className="mr-3 h-5 w-5" />
    <span className="font-medium">Create task</span>
  </button>
)

// Custom styles for react-select
const customSelectStyles = {
  control: (provided: any) => ({
    ...provided,
    borderRadius: "0.5rem",
    border: "1px solid #e2e8f0",
    boxShadow: "none",
    "&:hover": {
      border: "1px solid #cbd5e0",
    },
  }),
  option: (provided: any, state: { isSelected: any }) => ({
    ...provided,
    backgroundColor: state.isSelected ? "#2d3748" : "white",
    color: state.isSelected ? "white" : "#2d3748",
    "&:hover": {
      backgroundColor: "#e2e8f0",
      color: "#2d3748",
    },
  }),
}

// Custom styles for react-datepicker
const CustomDatePicker = ({ ...props }) => {
  return (
    <DatePicker
      {...props}
      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 focus:border-transparent transition-all"
    />
  )
}

// TaskManager Component
export default function TaskManager() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<ViewType>("day")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const formattedDate = format(currentDate, "yyyy-MM-dd")
  const { tasks, loading, refetch } = useTasks(currentDate, view)

  useEffect(() => {
    console.log("Formatted Date:", formattedDate)
  }, [formattedDate])

  const handleNext = () => {
    if (view === "day") {
      setCurrentDate((prev) => addDays(prev, 1))
    } else if (view === "week") {
      setCurrentDate((prev) => addDays(prev, 7))
    } else if (view === "month") {
      setCurrentDate((prev) => addMonths(prev, 1))
    } else if (view === "year") {
      setCurrentDate((prev) => addYears(prev, 1))
    }
  }

  const handlePrevious = () => {
    if (view === "day") {
      setCurrentDate((prev) => subDays(prev, 1))
    } else if (view === "week") {
      setCurrentDate((prev) => subDays(prev, 7))
    } else if (view === "month") {
      setCurrentDate((prev) => subMonths(prev, 1))
    } else if (view === "year") {
      setCurrentDate((prev) => subYears(prev, 1))
    }
  }

  const handleViewChange = (newView: ViewType) => {
    setView(newView)
    if (newView === "week") {
      setCurrentDate(startOfWeek(new Date()))
    } else if (newView === "month") {
      setCurrentDate(startOfMonth(new Date()))
    } else if (newView === "year") {
      setCurrentDate(startOfYear(new Date()))
    }
  }

  const formattedDisplayDate = format(currentDate, "MMM dd, yyyy")
  const dayOfWeek = format(currentDate, "EEEE")

  // Open Modal
  const openModal = () => setIsModalOpen(true)
  const [error, setError] = useState("")

  // Close Modal
  const closeModal = () => setIsModalOpen(false)
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")

    const formData = new FormData(e.currentTarget)

    try {
      await createTask(formData)
      setIsModalOpen(false)
      refetch()
    } catch (err) {
      // @ts-ignore
      setError(err.message)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <motion.div
        className="h-screen p-4  lg:p-8 flex flex-col"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-6   mx-auto w-full">
          {/* Sidebar */}
          <motion.div
            className="md:col-span-1 bg-white/80  dark:bg-gray-900/80 backdrop-blur-lg rounded-3xl shadow-lg overflow-hidden border border-gray-200/50 dark:border-gray-700/50"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <div className="p-6 overflow-y-auto py-3">
              <motion.h1
                className="text-4xl font-bold text-gray-900 dark:text-white mb-8 tracking-tight"
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Quickly
              </motion.h1>
              <nav className="space-y-2 overflow-auto max-h-96">
                {/* Modal Button */}
                <ModalButton openModal={openModal} />
                {(["day", "week", "month", "year"] as ViewType[]).map((v, index) => (
                  <motion.button
                    key={v}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 + index * 0.1 }}
                    className={clsx(
                      "w-full text-left py-3 px-4 rounded-xl transition-all duration-200 flex items-center",
                      view === v
                        ? "bg-gray-900 text-white shadow-lg dark:bg-white dark:text-gray-900 scale-105"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800",
                    )}
                    onClick={() => handleViewChange(v)}
                  >
                    <Calendar className="mr-3 h-5 w-5" />
                    <span className="font-medium">{v.charAt(0).toUpperCase() + v.slice(1)}</span>
                  </motion.button>
                ))}
              </nav>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            className="md:col-span-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg rounded-3xl shadow-lg overflow-hidden border border-gray-200/50 dark:border-gray-700/50"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="h-full flex flex-col p-6">
              <motion.div
                className="flex justify-between items-center mb-8"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <button onClick={handlePrevious} className="p-3 rounded-xl bg-black transition-colors">
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{dayOfWeek}</h2>
                  <p className="text-gray-500 dark:text-gray-400 text-lg">{formattedDisplayDate}</p>
                </div>
                <button onClick={handleNext} className="p-3 rounded-xl bg-black transition-colors">
                  <ChevronRight className="h-6 w-6" />
                </button>
              </motion.div>

              <motion.div
                className="space-y-4 flex-1 overflow-y-auto pr-4 custom-scrollbar"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white"></div>
                  </div>
                ) : tasks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
                    <Calendar className="h-16 w-16 mb-4 opacity-50" />
                    <p className="text-xl font-medium">No tasks for this period</p>
                    <p className="text-sm">Time to add some tasks!</p>
                  </div>
                ) : (
                  <AnimatePresence mode="popLayout">
                    {tasks.map((task, index) => (
                      <TaskItem key={task.id} task={task} index={index} refetch={refetch} />
                    ))}
                  </AnimatePresence>
                )}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Modal Component */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-lg w-full mx-auto space-y-6"
        >
          {error && <div className="text-red-500">{error}</div>}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create New Task</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Add a new task to your schedule</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Task Title</label>
              <input
                name="title"
                type="text"
                placeholder="Enter task title"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 focus:border-transparent transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
              <textarea
                name="description"
                placeholder="Enter task description"
                rows={4}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 focus:border-transparent transition-all resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Priority</label>
              <Select
                name="priority"
                options={[
                  { value: "LOW", label: "Low" },
                  { value: "MEDIUM", label: "Medium" },
                  { value: "HIGH", label: "High" },
                ]}
                styles={customSelectStyles}
                placeholder="Select priority"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Due Date</label>
              <CustomDatePicker
                name="dueDate"
                selected={new Date()}
                onChange={(date: Date) => {}}
                dateFormat="yyyy-MM-dd"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
              >
                Create Task
              </button>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  )
}

// Task Item Component
const TaskItem = ({
  task,
  index,
  refetch,
}: {
  task: any
  index: number
  refetch: () => void
}) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [error, setError] = useState("")

  const handleCheck = async () => {
    const newStatus = task.status === "COMPLETED" ? "NOT_STARTED" : "COMPLETED"
    await updateTaskStatus(task.id, newStatus)
    refetch()
  }

  const handleDelete = async () => {
    await deleteTask(task.id)
    refetch()
  }

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")

    const formData = new FormData(e.currentTarget)

    try {
      await updateTask(task.id, formData)
      refetch()
      setIsEditModalOpen(false)
    } catch (err) {
      // @ts-ignore
      setError(err.message)
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2, delay: index * 0.1 }}
      className="group bg-gray-50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-200 p-5 border border-gray-100 dark:border-gray-700/50"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4">
          <div className="mt-1">
            <button onClick={handleCheck}>
              {task.status === "COMPLETED" ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <Circle className="h-5 w-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
              )}
            </button>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white text-lg">{task.text}</h3>
            {task.description && <p className="text-gray-500 dark:text-gray-400 mt-1">{task.description}</p>}
          </div>
        </div>
        <PriorityBadge priority={task.priority} />
      </div>
      <div className="mt-4 flex items-center space-x-3 text-sm">
        <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-600 dark:text-gray-300 font-medium">
          {task.status}
        </span>
        <span className="text-gray-500 dark:text-gray-400">{format(new Date(task.date), "MMM d, yyyy")}</span>
      </div>
      <div className="flex justify-end space-x-2 mt-4">
        <button onClick={() => setIsEditModalOpen(true)} className="text-blue-500">
          Edit
        </button>
        <button onClick={handleDelete} className="text-red-500">
          Delete
        </button>
      </div>

      {/* Edit Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <form
          onSubmit={handleEditSubmit}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-lg w-full mx-auto space-y-6"
        >
          {error && <div className="text-red-500">{error}</div>}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Task</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Task Title</label>
              <input
                name="title"
                type="text"
                defaultValue={task.text}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 focus:border-transparent transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
              <textarea
                name="description"
                defaultValue={task.description}
                rows={4}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 focus:border-transparent transition-all resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Priority</label>
              <Select
                name="priority"
                options={[
                  { value: "LOW", label: "Low" },
                  { value: "MEDIUM", label: "Medium" },
                  { value: "HIGH", label: "High" },
                ]}
                styles={customSelectStyles}
                defaultValue={{ value: task.priority, label: task.priority }}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Due Date</label>
              <CustomDatePicker
                name="dueDate"
                selected={new Date(task.date)}
                onChange={(date: Date) => {}}
                dateFormat="yyyy-MM-dd"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
              >
                Update Task
              </button>
            </div>
          </div>
        </form>
      </Modal>
    </motion.div>
  )
}

// Priority Badge Component
const PriorityBadge = ({ priority }: { priority: string }) => {
  const getColor = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return "bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400"
      case "MEDIUM":
        return "bg-yellow-100 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400"
      case "LOW":
        return "bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400"
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
    }
  }

  return (
    <div className={clsx("flex items-center px-3 py-1 rounded-full text-sm font-medium", getColor(priority))}>
      <AlertCircle className="h-4 w-4 mr-1.5" />
      {priority}
    </div>
  )
}

interface IModal {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
}

export const Modal: React.FC<IModal> = ({ isOpen, onClose, children }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg overflow-hidden"
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

