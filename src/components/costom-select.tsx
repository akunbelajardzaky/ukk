import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  options: Option[];
  value?: Option | null;
  onChange: (option: Option) => void;
  placeholder?: string;
  name?: string;
  required?: boolean;
}

export const CustomSelect = ({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  name,
  required,
}: CustomSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={selectRef}>
      <div
        className="flex items-center justify-between w-full px-4 py-2.5 text-left bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:border-gray-300 dark:hover:border-gray-600 transition-all"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={value ? 'text-gray-900 dark:text-white' : 'text-gray-500'}>
          {value ? value.label : placeholder}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="h-5 w-5 text-gray-500" />
        </motion.div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg"
          >
            {options.map((option) => (
              <div
                key={option.value}
                className="px-4 py-2.5 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 first:rounded-t-lg last:rounded-b-lg transition-colors"
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
              >
                <span className="text-gray-900 dark:text-white">{option.label}</span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      
      {name && (
        <input
          type="hidden"
          name={name}
          value={value?.value || ''}
          required={required}
        />
      )}
    </div>
  );
};
