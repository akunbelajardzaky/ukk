import type * as React from "react"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import { motion, AnimatePresence } from "framer-motion"

export const TaskDropdown = ({ children }: { children: React.ReactNode }) => (
  <DropdownMenu.Root>
    <DropdownMenu.Trigger asChild>
      <button className="IconButton" aria-label="More options">
        •••
      </button>
    </DropdownMenu.Trigger>
    <AnimatePresence>
      <DropdownMenu.Portal forceMount>
        <DropdownMenu.Content className="DropdownMenuContent" sideOffset={5} asChild>
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            {children}
          </motion.div>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </AnimatePresence>
  </DropdownMenu.Root>
)