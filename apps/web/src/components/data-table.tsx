// DataTable.tsx
"use client"

import {type ColumnDef, flexRender, type Table,} from "@tanstack/react-table"
import {AnimatePresence, motion} from "framer-motion"

import {Table as UITable, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table"
import {DataTablePagination} from "@/components/data-table-pagination"
import {DataTableViewOptions} from "@/components/data-table-view-options"
import {Skeleton} from "@/components/ui/skeleton"
import {useState} from "react";
import {Input} from "@/components/ui/input";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    table: Table<TData>
    isLoading?: boolean
    onSearchChange: (value: string) => void
    currentEntity?: string
}

export function DataTable<TData, TValue>({
                                             columns,
                                             data,
                                             table,
                                             isLoading = false,
                                             onSearchChange,
                                             currentEntity
                                         }: DataTableProps<TData, TValue>) {

    const [search, setSearch] = useState("")

    const handleSearch = (value: string) => {
        setSearch(value)
        onSearchChange?.(value)
    }

    return (
        <div>
            {/* View Options */}
            <motion.div
                className={"flex items-center gap-2 lg:justify-between py-4"}
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                transition={{duration: 0.3}}
            >
                <Input className={"lg:max-w-64 capitalize"} type={"text"} placeholder={`Search ${currentEntity}...`} value={search}
                       onChange={(e) => handleSearch(e.target.value)}/>
                <DataTableViewOptions table={table}/>
            </motion.div>

            {/* Table Container */}
            <div
                className="overflow-hidden rounded-md border"
            >
                <UITable className="w-full">
                    {/* Header */}
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>

                    {/* Body */}
                    <TableBody>
                        <AnimatePresence mode="wait">
                            {isLoading ? (
                                // Skeleton Loading State
                                Array.from({length: table.getState().pagination.pageSize}).map((_, i) => (
                                    <motion.tr
                                        key={`skeleton-${i}`}
                                        initial={{opacity: 0}}
                                        animate={{opacity: 1}}
                                        exit={{opacity: 0}}
                                        transition={{duration: 0.2}}
                                        className="border-b"
                                    >
                                        {columns.map((_, j) => (
                                            <TableCell key={j}>
                                                <Skeleton className="h-6 w-full"/>
                                            </TableCell>
                                        ))}
                                    </motion.tr>
                                ))
                            ) : data?.length ? (
                                // Data Rows
                                table.getRowModel().rows.map((row, i) => (
                                    <motion.tr
                                        key={row.id}
                                        initial={{opacity: 0}}
                                        animate={{opacity: 1}}
                                        transition={{
                                            duration: 0.2,
                                            delay: i * 0.02
                                        }}
                                        className="border-b transition-colors hover:bg-accent hover:text-accent-foreground"
                                        data-state={row.getIsSelected() && "selected"}
                                        // onClick={() => navigate({to: `${location.pathname}/${row.original.id}`})}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id} className={"max-w-64 truncate"}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </motion.tr>
                                ))
                            ) : (
                                // No Results
                                <motion.tr
                                    initial={{opacity: 0}}
                                    animate={{opacity: 1}}
                                    transition={{duration: 0.3}}
                                >
                                    <TableCell colSpan={columns.length} className="h-24 text-center">
                                        No results.
                                    </TableCell>
                                </motion.tr>
                            )}
                        </AnimatePresence>
                    </TableBody>
                </UITable>
            </div>

            <DataTablePagination table={table}/>
        </div>
    )
}