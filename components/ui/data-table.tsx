import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface DataTableProps {
  children: React.ReactNode
  className?: string
}

interface DataTableHeaderProps {
  children: React.ReactNode
  className?: string
}

interface DataTableBodyProps {
  children: React.ReactNode
  className?: string
}

interface DataTableRowProps {
  children: React.ReactNode
  className?: string
  index?: number
}

interface DataTableCellProps {
  children: React.ReactNode
  className?: string
}

interface DataTableHeadProps {
  children: React.ReactNode
  className?: string
}

export function DataTable({ children, className }: DataTableProps) {
  return (
    <div className={cn("overflow-hidden rounded-lg border bg-white shadow-sm", className)}>
      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          {children}
        </table>
      </div>
    </div>
  )
}

export function DataTableHeader({ children, className }: DataTableHeaderProps) {
  return (
    <thead className={cn("bg-gray-50/80 backdrop-blur-sm", className)}>
      {children}
    </thead>
  )
}

export function DataTableBody({ children, className }: DataTableBodyProps) {
  return (
    <tbody className={cn("divide-y divide-gray-200", className)}>
      {children}
    </tbody>
  )
}

export function DataTableRow({ children, className, index = 0 }: DataTableRowProps) {
  return (
    <motion.tr
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ 
        duration: 0.3, 
        delay: index * 0.05,
        ease: "easeOut"
      }}
      className={cn(
        "group transition-colors duration-200 hover:bg-gray-50/50",
        className
      )}
    >
      {children}
    </motion.tr>
  )
}

export function DataTableHead({ children, className }: DataTableHeadProps) {
  return (
    <th
      className={cn(
        "px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500",
        className
      )}
    >
      {children}
    </th>
  )
}

export function DataTableCell({ children, className }: DataTableCellProps) {
  return (
    <td
      className={cn(
        "px-6 py-4 text-sm text-gray-900 transition-colors duration-200",
        className
      )}
    >
      {children}
    </td>
  )
}
