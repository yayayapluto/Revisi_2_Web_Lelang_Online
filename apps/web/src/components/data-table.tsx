"use client"

import {
    type ColumnDef,
    flexRender,
    getCoreRowModel,
    type Table,
    useReactTable,
} from "@tanstack/react-table"

import {
    Table as UITable,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { DataTablePagination } from "@/components/data-table-pagination"
import { DataTableViewOptions } from "@/components/data-table-view-options"
import { Input } from "@/components/ui/input"
import { useState, useRef, useEffect } from "react"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    table?: Table<TData>
    isLoading?: boolean
    onSearchChange?: (value: string) => void
    currentEntity?: string
    usePagination?: boolean
}

export function DataTable<TData, TValue>({
                                             columns,
                                             data,
                                             table: externalTable,
                                             isLoading = false,
                                             onSearchChange,
                                             currentEntity,
                                             usePagination = true,
                                         }: DataTableProps<TData, TValue>) {
    const [search, setSearch] = useState("")
    const lastDataRef = useRef<TData[]>(data) // 👈 Store last valid data

    // 👇 Update ref whenever data changes (and not loading)
    useEffect(() => {
        if (!isLoading) {
            lastDataRef.current = data
        }
    }, [data, isLoading])

    // 👇 Use external table or create internal one
    const table = externalTable || useReactTable({
        data: isLoading ? lastDataRef.current : data, // ✅ Use last data while loading
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    const handleSearch = (value: string) => {
        setSearch(value)
        onSearchChange?.(value)
    }

    return (
        <div className="space-y-4">
            {/* View Options */}
            <div className="flex items-center gap-2 lg:justify-between">
                {onSearchChange && (
                    <Input
                        className="lg:max-w-64 capitalize"
                        type="text"
                        placeholder={`Search ${currentEntity}...`}
                        value={search}
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                )}
                {table && <DataTableViewOptions table={table} />}
            </div>

            {/* Table Container */}
            <div className="overflow-x-auto rounded-md border">
                <UITable className="min-w-full">
                    {/* Header */}
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>

                    {/* Body */}
                    <TableBody>
                        {table.getRowModel().rows.length > 0 ? (
                            table.getRowModel().rows.map((row) => (
                                <tr
                                    key={row.id}
                                    className="border-b transition-colors hover:bg-accent hover:text-accent-foreground"
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="max-w-64 truncate">
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    {isLoading ? "Loading..." : "No results."}
                                </TableCell>
                            </tr>
                        )}
                    </TableBody>
                </UITable>
            </div>

            {usePagination && <DataTablePagination table={table} />}
        </div>
    )
}