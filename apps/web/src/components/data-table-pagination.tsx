import {type Table} from "@tanstack/react-table"
import {motion} from "framer-motion"
import {ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,} from "lucide-react"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Button} from "@/components/ui/button"

interface DataTablePaginationProps<TData> {
    table: Table<TData>
}

export function DataTablePagination<TData>({
                                               table,
                                           }: DataTablePaginationProps<TData>) {
    return (
        <motion.div
            className="flex items-center justify-between space-x-6 lg:space-x-8"
        >
            {/* Rows per page */}
            <motion.div
                className="flex items-center space-x-2"
            >
                <p className="text-sm font-medium hidden md:block">Rows per page</p>
                <motion.div
                    whileTap={{scale: 0.95}}
                >
                    <Select
                        value={`${table.getState().pagination.pageSize}`}
                        onValueChange={(value) => {
                            table.setPageSize(Number(value))
                        }}
                    >
                        <SelectTrigger className="h-8 w-[70px]">
                            <SelectValue placeholder={table.getState().pagination.pageSize}/>
                        </SelectTrigger>
                        <SelectContent side="top">
                            {[10, 25, 50].map((pageSize) => (
                                <SelectItem key={pageSize} value={`${pageSize}`}>
                                    {pageSize}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </motion.div>
            </motion.div>

            {/* Page info */}
            <motion.div
                className="flex w-[100px] items-center justify-center text-sm font-medium"
                key={`${table.getState().pagination.pageIndex}-${table.getPageCount()}`} // Re-animate on page change
            >
                Page {table.getState().pagination.pageIndex + 1} of{" "}
                {table.getPageCount()}
            </motion.div>

            {/* Navigation buttons */}
            <motion.div
                className="flex items-center space-x-2"
            >
                {/* First page */}
                <motion.div
                    whileHover={{scale: 1.05}}
                    whileTap={{scale: 0.95}}
                >
                    <Button
                        variant="outline"
                        className="hidden lg:flex"
                        onClick={() => table.setPageIndex(0)}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <span className="sr-only">Go to first page</span>
                        <ChevronsLeft/>
                    </Button>
                </motion.div>

                {/* Previous page */}
                <motion.div
                    whileHover={{scale: 1.05}}
                    whileTap={{scale: 0.95}}
                >
                    <Button
                        variant="outline"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <span className="sr-only">Go to previous page</span>
                        <ChevronLeft/>
                    </Button>
                </motion.div>

                {/* Next page */}
                <motion.div
                    whileHover={{scale: 1.05}}
                    whileTap={{scale: 0.95}}
                >
                    <Button
                        variant="outline"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        <span className="sr-only">Go to next page</span>
                        <ChevronRight/>
                    </Button>
                </motion.div>

                {/* Last page */}
                <motion.div
                    whileHover={{scale: 1.05}}
                    whileTap={{scale: 0.95}}
                >
                    <Button
                        variant="outline"
                        className="hidden lg:flex"
                        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                        disabled={!table.getCanNextPage()}
                    >
                        <span className="sr-only">Go to last page</span>
                        <ChevronsRight/>
                    </Button>
                </motion.div>
            </motion.div>
        </motion.div>
    )
}