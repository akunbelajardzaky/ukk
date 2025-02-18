import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
} from "date-fns";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface CustomDatePickerProps {
  value: Date;
  onChange: (date: Date) => void;
  name?: string;
  required?: boolean;
}

export const CustomDatePicker = ({
  value,
  onChange,
  name,
  required,
}: CustomDatePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(value);
  const calendarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const previousMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  return (
    <div className="relative" ref={calendarRef}>
      <div
        className="flex items-center w-full px-4 py-2.5 text-left text-black border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:border-gray-300 dark:hover:border-gray-600 transition-all"
        onClick={() => setIsOpen(!isOpen)}
      >
        <CalendarIcon className="h-5 w-5  mr-2" />
        <span className=" ">{format(value, "PPP")}</span>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: -400 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.15 }}
            className="absolute z-0 mt-1 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <button
                type="button"
                onClick={previousMonth}
                className="p-2 text-black   rounded-full transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <h2 className="text-lg text-black  font-semibold">
                {format(currentMonth, "MMMM yyyy")}
              </h2>
              <button
                onClick={nextMonth}
                type="button"
                className="p-2  text-black  rounded-full transition-colors"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div
                  key={day}
                  className="text-center text-sm font-medium text-gray-500 dark: py-2"
                >
                  {day}
                </div>
              ))}

              {Array.from({ length: startOfMonth(currentMonth).getDay() }).map(
                (_, index) => (
                  <div key={`empty-${index}`} />
                )
              )}

              {days.map((day) => {
                const isSelected = isSameDay(value, day);
                const isCurrentMonth = isSameMonth(day, currentMonth);

                return (
                  <button
                    type="button"
                    key={day.toISOString()}
                    onClick={() => {
                      onChange(day);
                    }}
                    className={`
                      h-10 w-10 rounded-full flex items-center justify-center text-sm transition-colors
                      ${
                        isSelected
                          ? "bg-indigo-600  hover:bg-indigo-700"
                          : isCurrentMonth
                          ? "text-gray-900   "
                          : " dark:text-gray-500"
                      }
                    `}
                  >
                    {format(day, "d")}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {name && (
        <input
          type="hidden"
          name={name}
          value={format(value, "yyyy-MM-dd")}
          required={required}
        />
      )}
    </div>
  );
};
