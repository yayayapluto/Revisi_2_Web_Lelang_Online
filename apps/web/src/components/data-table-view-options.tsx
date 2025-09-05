"use client"

import {type Table} from "@tanstack/react-table"
import {Settings2} from "lucide-react"
import {Button} from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger
} from "@/components/animate-ui/radix/dropdown-menu";
import {motion} from "framer-motion";

export function DataTableViewOptions<TData>({
                                                table,
                                            }: {
    table: Table<TData>
}) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <motion.div
                    whileHover={{scale: 1.05}}
                    whileTap={{scale: 1.05}}
                >
                    <Button
                        variant="outline"
                    >
                        Columns
                        <Settings2/>
                    </Button>
                </motion.div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[150px]">
                {table
                    .getAllColumns()
                    .filter(
                        (column) =>
                            typeof column.accessorFn !== "undefined" && column.getCanHide()
                    )
                    .map((column) => {
                        return (
                            <DropdownMenuCheckboxItem
                                key={column.id}
                                className="capitalize"
                                checked={column.getIsVisible()}
                                onCheckedChange={(value) => column.toggleVisibility(value)}
                            >
                                {column.id}
                            </DropdownMenuCheckboxItem>
                        )
                    })}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
