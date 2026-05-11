import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { cn } from "@/lib/utils"
import { useTranslation } from "react-i18next"

interface DataPaginationProps {
  page: number
  totalPages: number
  rowsPerPage: number
  onPageChange: (page: number) => void
  onRowsPerPageChange: (value: number) => void
  showRowsPerPage?: boolean
}

export function DataPagination({
  page,
  totalPages,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  showRowsPerPage,
}: DataPaginationProps) {
  const { t } = useTranslation()

  function generatePages(): Array<number | string> {
    if (totalPages <= 3) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    if (page <= 2) {
      return [1, 2, 3, "ellipsis-end", totalPages]
    }

    if (page >= totalPages - 1) {
      return [totalPages - 2, totalPages - 1, totalPages]
    }

    return [page - 1, page, page + 1, "ellipsis-end", totalPages]
  }

  const canGoPrevious = page > 1
  const canGoNext = page < totalPages

  return (
    <div className="mt-6 flex w-full flex-col gap-4 md:flex-row md:items-center md:justify-between">
      {showRowsPerPage && (
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground whitespace-nowrap">
            {t("global.pagination.rows-per-page")}
          </span>

          <Select
            value={String(rowsPerPage)}
            onValueChange={(value) => onRowsPerPageChange(Number(value))}
          >
            <SelectTrigger className="h-9 w-20 rounded-xl">
              <SelectValue placeholder="Select" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <Pagination className="flex items-center justify-end">
        <PaginationContent className="gap-2">
          <PaginationItem>
            <PaginationPrevious
              onClick={() => canGoPrevious && onPageChange(page - 1)}
              className={cn(
                "rounded-full text-sm text-black dark:text-white",
                canGoPrevious ? "cursor-pointer" : "pointer-events-none opacity-50",
              )}
            />
          </PaginationItem>

          {generatePages().map((item, index) =>
            item === "ellipsis-end" ? (
              <PaginationItem key={`ellipsis-${index}`}>
                <PaginationEllipsis className="text-black dark:text-white" />
              </PaginationItem>
            ) : (
              <PaginationItem key={index}>
                <PaginationLink
                  onClick={() => onPageChange(Number(item))}
                  isActive={page === item}
                  className={cn(
                    "flex h-9 w-9 cursor-pointer items-center justify-center rounded-full transition-all text-black dark:text-white hover:bg-primary dark:hover:bg-primary",
                    page === item && "bg-black dark:bg-white text-white dark:text-black",
                  )}
                >
                  {item}
                </PaginationLink>
              </PaginationItem>
            ),
          )}

          <PaginationItem>
            <PaginationNext
              onClick={() => canGoNext && onPageChange(page + 1)}
              className={cn(
                "rounded-full text-sm text-black dark:text-white",
                canGoNext ? "cursor-pointer" : "pointer-events-none opacity-50",
              )}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
