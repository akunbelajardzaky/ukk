"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
} from "date-fns";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Circle,
  AlertCircle,
  PlusCircle,
  Menu,
  X,
  Search,
} from "lucide-react";
import { useTasks } from "@/hooks/use-task";
import clsx from "clsx";
import "react-datepicker/dist/react-datepicker.css";
import {
  createTask,
  deleteTask,
  updateTask,
  updateTaskStatus,
} from "@/action/create";
import { CustomDatePicker } from "@/components/costom-datepicker";
import { CustomSelect } from "@/components/costom-select";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import { SignOutButton } from "@/components/sign-out-button";
import { toast } from "sonner"; // Import Sonner toast
import { logout } from "@/lib/actions/auth";
import OpenAI from "openai"; // Import OpenAI library
import Groq from "groq-sdk";

type ViewType = "day" | "week" | "month" | "year" | "today";

export default function TaskManager() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<ViewType>("day");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const formattedDate = format(currentDate, "yyyy-MM-dd");
  const { tasks, loading, refetch } = useTasks(currentDate, view, searchQuery);

  const handleNext = () => {
    if (view === "day") setCurrentDate((prev) => addDays(prev, 1));
    else if (view === "week") setCurrentDate((prev) => addDays(prev, 7));
    else if (view === "month") setCurrentDate((prev) => addMonths(prev, 1));
    else if (view === "year") setCurrentDate((prev) => addYears(prev, 1));
  };

  const handlePrevious = () => {
    if (view === "day") setCurrentDate((prev) => subDays(prev, 1));
    else if (view === "week") setCurrentDate((prev) => subDays(prev, 7));
    else if (view === "month") setCurrentDate((prev) => subMonths(prev, 1));
    else if (view === "year") setCurrentDate((prev) => subYears(prev, 1));
  };

  const handleViewChange = (newView: ViewType) => {
    setView(newView);
    if (newView === "week") setCurrentDate(startOfWeek(new Date()));
    else if (newView === "month") setCurrentDate(startOfMonth(new Date()));
    else if (newView === "year") setCurrentDate(startOfYear(new Date()));
    setIsSidebarOpen(false);
  };

  const formattedDisplayDate = format(currentDate, "MMM dd, yyyy");
  const dayOfWeek = format(currentDate, "EEEE");

  const openModal = () => setIsModalOpen(true);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true); // Set loading ke true

    const formData = new FormData(e.currentTarget);
    try {
      await createTask(formData);
      setIsModalOpen(false);
      refetch();
      toast.success("Task created successfully!"); // Toast sukses
    } catch (err: any) {
      setError(err.message);
      toast.error("Failed to create task"); // Toast error
    } finally {
      setIsLoading(false); // Set loading ke false
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-gray-900 dark:to-indigo-900 min-h-screen">
      <div className="h-screen p-4 lg:p-8 flex">
        {/* Sidebar for larger screens */}
        <motion.div
          className="hidden md:block w-64 bg-white dark:bg-gray-800 rounded-3xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 mr-6"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Sidebar
            view={view}
            handleViewChange={handleViewChange}
            openModal={openModal}
          />
        </motion.div>

        {/* Main Content */}
        <motion.div
          className="flex-1 bg-white dark:bg-gray-800 rounded-3xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="h-full flex flex-col">
            <div className="p-6">
              <motion.div
                className="mb-6"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="relative mb-4">
                  <input
                    onChange={(e) => setSearchQuery(e.target.value)}
                    type="text"
                    placeholder="Search here"
                    className="pl-10 pr-4 py-2 border bg-white rounded-xl border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex gap-3">
                    <button
                      onClick={() => setIsSidebarOpen(true)}
                      className="md:hidden p-2 rounded-xl bg-indigo-100 text-indigo-600 hover:bg-indigo-200 transition-colors"
                    >
                      <Menu className="h-6 w-6" />
                    </button>
                    <button
                      onClick={handlePrevious}
                      className="p-2 rounded-xl  bg-indigo-100 text-indigo-600 hover:bg-indigo-200 transition-colors"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>
                  </div>
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {dayOfWeek}
                    </h2>
                    <p className="text-indigo-600 dark:text-indigo-400 text-lg">
                      {formattedDisplayDate}
                    </p>
                  </div>
                  <button
                    onClick={handleNext}
                    className="p-2 rounded-xl bg-indigo-100 text-indigo-600 hover:bg-indigo-200 transition-colors"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </div>
              </motion.div>
            </div>

            <div className="flex-1 overflow-hidden">
              <TaskList tasks={tasks} loading={loading} refetch={refetch} />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Modal Component */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <TaskForm
          setIsModalOpen={setIsModalOpen}
          onSubmit={handleSubmit}
          error={error}
          isLoading={isLoading} // Kirim isLoading ke TaskForm
        />
      </Modal>

      {/* Sidebar for mobile */}
      <div className="md:hidden block">
        <MobileSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          view={view}
          handleViewChange={handleViewChange}
          openModal={openModal}
        />
      </div>
    </div>
  );
}

const Sidebar = ({
  view,
  handleViewChange,
  openModal,
}: {
  view: ViewType;
  handleViewChange: (view: ViewType) => void;
  openModal: () => void;
}) => (
  <div className="p-6 h-full flex flex-col">
    {/* Header */}
    <h1 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-8">
      Quickly
    </h1>

    {/* Navigation Menu */}
    <nav className="space-y-2 flex-1">
      {/* Create Task Button */}
      <button
        className="w-full text-left py-3 px-4 rounded-xl transition-all duration-200 flex items-center bg-indigo-600 text-white shadow-lg hover:bg-indigo-700"
        onClick={openModal}
      >
        <PlusCircle className="mr-3 h-5 w-5" />
        <span className="font-medium">Create task</span>
      </button>

      {/* View Buttons (Day, Week, Month, Year) */}
      {(["day", "week", "month", "year"] as ViewType[]).map((v, index) => (
        <motion.button
          key={v}
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 + index * 0.1 }}
          className={clsx(
            "w-full text-left py-3 px-4 rounded-xl transition-all duration-200 flex items-center",
            view === v
              ? "bg-indigo-100 text-indigo-600 shadow-md scale-105"
              : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
          )}
          onClick={() => handleViewChange(v)}
        >
          <Calendar className="mr-3 h-5 w-5" />
          <span className="font-medium">
            {v.charAt(0).toUpperCase() + v.slice(1)}
          </span>
        </motion.button>
      ))}
    </nav>

    {/* Sign Out Button */}
    <div className="mt-auto">
      {" "}
      {/* mt-auto untuk mendorong ke bawah */}
      <button
        onClick={() => logout()}
        className="w-full text-left py-3 px-4 rounded-xl transition-all duration-200 flex items-center bg-red-600 text-white shadow-lg hover:bg-red-700"
      >
        SignOut
      </button>
    </div>
  </div>
);
const MobileSidebar = ({
  isOpen,
  onClose,
  view,
  handleViewChange,
  openModal,
}: {
  isOpen: boolean;
  onClose: () => void;
  view: ViewType;
  handleViewChange: (view: ViewType) => void;
  openModal: () => void;
}) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        exit={{ x: "-100%" }}
        transition={{ type: "tween" }}
        className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 shadow-lg z-50 "
      >
        <div className="p-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
            Menu
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <Sidebar
          view={view}
          handleViewChange={handleViewChange}
          openModal={openModal}
        />
      </motion.div>
    )}
  </AnimatePresence>
);

const TaskList = ({
  tasks,
  loading,
  refetch,
}: {
  tasks: any[];
  loading: boolean;
  refetch: () => void;
}) => (
  <motion.div
    className="h-full relative px-6 pb-6 space-y-4"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.4 }}
  >
    <ScrollAreaPrimitive.Root className="w-full h-full pr-3">
      <ScrollAreaPrimitive.Viewport className="w-full h-full">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
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
              <TaskItem
                key={task.id}
                task={task}
                index={index}
                refetch={refetch}
              />
            ))}
          </AnimatePresence>
        )}
      </ScrollAreaPrimitive.Viewport>

      <ScrollAreaPrimitive.Scrollbar
        className="absolute right-0 top-0 h-full w-2 bg-gray-200 rounded-full"
        orientation="vertical"
      >
        <ScrollAreaPrimitive.Thumb className="bg-black/10 rounded-xl" />
      </ScrollAreaPrimitive.Scrollbar>
    </ScrollAreaPrimitive.Root>
  </motion.div>
);

const TaskItem = ({
  task,
  index,
  refetch,
}: {
  task: any;
  index: number;
  refetch: () => void;
}) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Loading state untuk edit/delete

  const handleCheck = async () => {
    const newStatus = task.status === "COMPLETED" ? "NOT_STARTED" : "COMPLETED";
    await updateTaskStatus(task.id, newStatus);
    refetch();
  };

  const handleDelete = async () => {
    setIsLoading(true); // Set loading ke true
    try {
      await deleteTask(task.id);
      refetch();
      toast.success("Task deleted successfully!"); // Toast sukses
    } catch (err: any) {
      toast.error("Failed to delete task"); // Toast error
    } finally {
      setIsLoading(false); // Set loading ke false
    }
  };

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true); // Set loading ke true

    const formData = new FormData(e.currentTarget);
    try {
      await updateTask(task.id, formData);
      refetch();
      setIsEditModalOpen(false);
      toast.success("Task updated successfully!"); // Toast sukses
    } catch (err: any) {
      setError(err.message);
      toast.error("Failed to update task"); // Toast error
    } finally {
      setIsLoading(false); // Set loading ke false
    }
  };

  return (
    <motion.div
    layout
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.2, delay: index * 0.1 }}
    className="group bg-white dark:bg-gray-800 mb-3 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-4 sm:p-5 border border-gray-100 dark:border-gray-700"
  >
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
      <div className="flex items-start space-x-3">
        <button 
          onClick={handleCheck}
          className="mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-full"
        >
          {task.status === "COMPLETED" ? (
            <CheckCircle className="h-5 w-5 text-green-500" />
          ) : (
            <Circle className="h-5 w-5 text-gray-400 group-hover:text-indigo-600 transition-colors" />
          )}
        </button>
        <div className="min-w-0 flex-1">
          <h3 className="font-medium text-gray-900 dark:text-white text-base sm:text-lg truncate">
            {task.text}
          </h3>
          {task.description && (
            <p className="text-gray-500 dark:text-gray-400 mt-0.5 text-sm line-clamp-2">
              {task.description}
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center sm:items-start flex-shrink-0">
        <PriorityBadge priority={task.priority} />
      </div>
    </div>

    <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center px-2.5 py-0.5 bg-indigo-50 dark:bg-indigo-900/50 rounded-full text-xs font-medium text-indigo-600 dark:text-indigo-300">
          {task.status}
        </span>
        <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
          {format(new Date(task.date), "MMM d, yyyy")}
        </span>
      </div>
      
      <div className="flex items-center space-x-2 w-full sm:w-auto">
        <button
          onClick={() => setIsEditModalOpen(true)}
          disabled={isLoading}
          className="flex-1 sm:flex-none px-3 py-1.5 text-sm bg-indigo-50 text-indigo-600 hover:bg-indigo-100 
          rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Editing..." : "Edit"}
        </button>
        <button
          onClick={handleDelete}
          disabled={isLoading}
          className="flex-1 sm:flex-none px-3 py-1.5 text-sm bg-red-50 text-red-600 hover:bg-red-100 
          rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>

    <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
      <TaskForm
        setIsModalOpen={setIsEditModalOpen}
        onSubmit={handleEditSubmit}
        error={error}
        isLoading={isLoading}
        initialData={task}
      />
    </Modal>
  </motion.div>
  );
};

const PriorityBadge = ({ priority }: { priority: string }) => {
  const getColor = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return "bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400";
      case "MEDIUM":
        return "bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400";
      case "LOW":
        return "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400";
    }
  };

  return (
    <div
      className={clsx(
        "flex items-center px-3 py-1 rounded-full text-sm font-medium",
        getColor(priority)
      )}
    >
      <AlertCircle className="h-4 w-4 mr-1.5" />
      {priority}
    </div>
  );
};

const Modal = ({
  isOpen,
  onClose,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) => (
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
);

const TaskForm = ({
  onSubmit,
  error,
  initialData,
  setIsModalOpen,
  isLoading,
}: {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  error: string;
  initialData?: any;
  setIsModalOpen: (value: boolean) => void;
  isLoading: boolean;
}) => {
  const [selectedDate, setSelectedDate] = useState(
    initialData?.date ? new Date(initialData.date) : new Date()
  );
  const [title, setTitle] = useState(initialData?.text || ""); // State untuk judul
  const [description, setDescription] = useState(initialData?.description || ""); // State untuk deskripsi
  const [isSummarizing, setIsSummarizing] = useState(false); // State untuk loading summarization

  const priorityOptions = [
    { value: "LOW", label: "Low Priority" },
    { value: "MEDIUM", label: "Medium Priority" },
    { value: "HIGH", label: "High Priority" },
  ];

  const [selectedPriority, setSelectedPriority] = useState(
    initialData?.priority
      ? priorityOptions.find((opt) => opt.value === initialData.priority)
      : null
  );

  // Fungsi untuk memanggil API AI (DeepSeek atau OpenAI)
  const handleSummarize = async () => {
    if (!title) {
      toast.error("Please fill in the title first.");
      return;
    }

    setIsSummarizing(true); // Set loading summarization

    try {
      const openai = new OpenAI({ 
        baseURL: "https://api.groq.com/openai/v1",
        apiKey:'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', // Ambil API key dari environment variable
        dangerouslyAllowBrowser: true, // Hanya untuk development, jangan digunakan di production
      });

      const prompt = `Summarize teks ini sesuai bahasa yang di masukan (summarize di gunakan untuk deskripsi tugas) contoh: (prompt: Lari pagi di lapangan karang, answer: Setelah subuh lari di lapangan karang dan minum susu sapi poang setelah dengan spotify): "${title}"`;
      const response = await openai.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
      });

      const summary = response.choices[0].message.content;
      setDescription(summary); // Set ringkasan ke textarea deskripsi
      toast.success("Description summarized successfully!");
    } catch (err) {
      console.error("Summarization error:", err);
      toast.error("Failed to summarize description.");
    } finally {
      setIsSummarizing(false); // Set loading summarization ke false
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-lg w-full mx-auto space-y-6"
    >
      {error && <div className="text-red-500">{error}</div>}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {initialData ? "Edit Task" : "Create New Task"}
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          {initialData
            ? "Update your task details"
            : "Add a new task to your schedule"}
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Task Title
          </label>
          <input
            name="title"
            type="text"
            value={title} // Controlled input
            onChange={(e) => setTitle(e.target.value)} // Update state judul
            placeholder="Enter task title"
            className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description
          </label>
          {/* Tombol Summarize */}
        
          <textarea
            name="description"
            value={description} // Controlled input
            onChange={(e) => setDescription(e.target.value)} // Update state deskripsi
            placeholder="Enter task description"
            rows={4}
            className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
          />
          <div className="justify-between flex"> 
            <div />
          <button
            type="button"
            onClick={handleSummarize}
            disabled={!title || isSummarizing} // Disable jika judul kosong atau sedang loading
            className="mb-2 px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSummarizing ? "Summarizing..." : "Summarize Description"}
          </button>

          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Priority
          </label>
          <CustomSelect
            name="priority"
            options={priorityOptions}
            value={selectedPriority}
            onChange={setSelectedPriority}
            placeholder="Select priority"
            required
          />
        </div>

        <div style={{ zIndex: 9999 }}>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Due Date
          </label>
          <CustomDatePicker
            name="dueDate"
            value={selectedDate}
            onChange={setSelectedDate}
            required
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => setIsModalOpen(false)}
            className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading} // Nonaktifkan tombol saat loading
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Loading..." : initialData ? "Update Task" : "Create Task"}
          </button>
        </div>
      </div>
    </form>
  );
};
