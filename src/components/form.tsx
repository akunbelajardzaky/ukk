import { useState } from 'react';
import { CustomSelect } from './costom-select';
import { CustomDatePicker } from './costom-datepicker';
import { X } from 'lucide-react';

interface TaskFormProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  error: string;
  initialData?: any;
  setIsModalOpen: (isOpen: boolean) => void;
}

export const TaskForm = ({
  onSubmit,
  error,
  initialData,
  setIsModalOpen,
}: TaskFormProps) => {
  const [selectedDate, setSelectedDate] = useState(
    initialData?.date ? new Date(initialData.date) : new Date()
  );

  const priorityOptions = [
    { value: 'LOW', label: 'Low Priority' },
    { value: 'MEDIUM', label: 'Medium Priority' },
    { value: 'HIGH', label: 'High Priority' },
  ];

  const [selectedPriority, setSelectedPriority] = useState(
    initialData?.priority
      ? priorityOptions.find((opt) => opt.value === initialData.priority)
      : null
  );

  return (
    <form
      onSubmit={onSubmit}
      className="bg-white dark:bg-gray-800 h-[1000px] rounded-xl p-6 space-y-6 w-full max-w-lg mx-auto shadow-xl"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {initialData ? 'Edit Task' : 'Create New Task'}
        </h2>
        <button
          type="button"
          onClick={() => setIsModalOpen(false)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/50 text-red-600 dark:text-red-400 rounded-lg">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Task Title
          </label>
          <input
            name="title"
            type="text"
            defaultValue={initialData?.text}
            placeholder="Enter task title"
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description
          </label>
          <textarea
            name="description"
            defaultValue={initialData?.description}
            placeholder="Enter task description"
            rows={4}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Priority
          </label>
          <CustomSelect
            name="priority"
            options={priorityOptions}
            // @ts-ignore
            value={selectedPriority}
            onChange={setSelectedPriority}
            placeholder="Select priority"
            required
          />
        </div>

        <div style={{ zIndex: 9999, position: 'relative' }}>
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
            className="px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
          >
            {initialData ? 'Update Task' : 'Create Task'}
          </button>
        </div>
      </div>
    </form>
  );
};