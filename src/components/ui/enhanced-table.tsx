
import * as React from "react"
import { ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

export type SortDirection = "asc" | "desc" | null

export interface Column<T> {
  key: keyof T
  label: string
  sortable?: boolean
  render?: (value: any, item: T) => React.ReactNode
  className?: string
}

export interface EnhancedTableProps<T> {
  data: T[]
  columns: Column<T>[]
  pageSize?: number
  sortable?: boolean
  onRowClick?: (item: T) => void
  selectedRows?: T[]
  onRowSelect?: (item: T, selected: boolean) => void
  bulkActions?: React.ReactNode
  className?: string
}

export function EnhancedTable<T extends { id: string | number }>({
  data,
  columns,
  pageSize = 10,
  sortable = true,
  onRowClick,
  selectedRows = [],
  onRowSelect,
  bulkActions,
  className,
}: EnhancedTableProps<T>) {
  const [currentPage, setCurrentPage] = React.useState(1)
  const [sortColumn, setSortColumn] = React.useState<keyof T | null>(null)
  const [sortDirection, setSortDirection] = React.useState<SortDirection>(null)

  // Sorting logic
  const sortedData = React.useMemo(() => {
    if (!sortColumn || !sortDirection) return data

    return [...data].sort((a, b) => {
      const aValue = a[sortColumn]
      const bValue = b[sortColumn]

      if (aValue === bValue) return 0
      
      const comparison = aValue < bValue ? -1 : 1
      return sortDirection === "asc" ? comparison : -comparison
    })
  }, [data, sortColumn, sortDirection])

  // Pagination logic
  const totalPages = Math.ceil(sortedData.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const paginatedData = sortedData.slice(startIndex, startIndex + pageSize)

  const handleSort = (column: keyof T) => {
    if (!sortable) return

    if (sortColumn === column) {
      if (sortDirection === "asc") {
        setSortDirection("desc")
      } else if (sortDirection === "desc") {
        setSortDirection(null)
        setSortColumn(null)
      } else {
        setSortDirection("asc")
      }
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  const getSortIcon = (column: keyof T) => {
    if (sortColumn !== column) {
      return <ChevronsUpDown className="h-4 w-4" />
    }
    if (sortDirection === "asc") {
      return <ChevronUp className="h-4 w-4" />
    }
    if (sortDirection === "desc") {
      return <ChevronDown className="h-4 w-4" />
    }
    return <ChevronsUpDown className="h-4 w-4" />
  }

  const isRowSelected = (item: T) => {
    return selectedRows.some(row => row.id === item.id)
  }

  return (
    <div className={cn("space-y-4", className)}>
      {bulkActions && selectedRows.length > 0 && (
        <div className="flex items-center gap-2 p-3 bg-primary-50 border border-primary-200 rounded-lg">
          <span className="text-sm font-medium">
            {selectedRows.length} item{selectedRows.length !== 1 ? 's' : ''} selected
          </span>
          {bulkActions}
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {onRowSelect && (
                <TableHead className="w-12">
                  <input
                    type="checkbox"
                    checked={selectedRows.length === data.length && data.length > 0}
                    onChange={(e) => {
                      data.forEach(item => {
                        onRowSelect(item, e.target.checked)
                      })
                    }}
                    className="rounded border-border"
                  />
                </TableHead>
              )}
              {columns.map((column) => (
                <TableHead
                  key={String(column.key)}
                  className={cn(
                    column.className,
                    sortable && column.sortable !== false && "cursor-pointer hover:bg-muted/50"
                  )}
                  onClick={() => sortable && column.sortable !== false && handleSort(column.key)}
                >
                  <div className="flex items-center gap-2">
                    {column.label}
                    {sortable && column.sortable !== false && getSortIcon(column.key)}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((item) => (
              <TableRow
                key={String(item.id)}
                className={cn(
                  "cursor-pointer hover:bg-muted/50",
                  isRowSelected(item) && "bg-primary-50",
                  onRowClick && "cursor-pointer"
                )}
                onClick={() => onRowClick?.(item)}
              >
                {onRowSelect && (
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={isRowSelected(item)}
                      onChange={(e) => {
                        e.stopPropagation()
                        onRowSelect(item, e.target.checked)
                      }}
                      className="rounded border-border"
                    />
                  </TableCell>
                )}
                {columns.map((column) => (
                  <TableCell key={String(column.key)} className={column.className}>
                    {column.render 
                      ? column.render(item[column.key], item)
                      : String(item[column.key] || '')
                    }
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = i + 1
              return (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => setCurrentPage(page)}
                    isActive={currentPage === page}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              )
            })}
            
            <PaginationItem>
              <PaginationNext 
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}
