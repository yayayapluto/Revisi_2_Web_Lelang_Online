import type {ColumnDef} from "@tanstack/react-table";
import type {ObjectType} from "@/types/objectType";
import {DataTableColumnHeader} from "@/components/data-table-column-header";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {EllipsisIcon} from "lucide-react";
import {Link} from "@tanstack/react-router";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import type {Item} from "@/types/item";
import {CurrencyFormatter} from "@/utils/currency-formatter";
import {Checkbox} from "@/components/ui/checkbox";

export const ItemColumn: ColumnDef<Item>[] = [
    {
        accessorKey: "name",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title={"Name"}/>
        ),
    },
    {
        accessorKey: "price",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title={"Price"}/>
        ),
        cell: ({row}) => CurrencyFormatter(row.original.price),
    },
    {
        accessorKey: "deposit_price",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title={"Deposit Price"}/>
        ),
        cell: ({row}) => CurrencyFormatter(row.original.deposit_price),
    },
    {
        accessorKey: "description",
        header: "Description",
    },
    {
        accessorKey: "object_type",
        header: "Object Type",
        cell : ({row}) => row.original.object_type.name
    },
    {
        accessorKey: "file",
        header: "Main Thumbnail",
        cell : ({row}) => row.original.file.path
    },
    {
        accessorKey: "created_at",
        header: "Created At",
        cell: ({row}) => new Date(Date.parse(row.original.created_at)).toUTCString(),
    },
    {
        accessorKey: "updated_at",
        header: "Updated At",
        cell: ({row}) => new Date(Date.parse(row.original.updated_at)).toUTCString(),
    },
    {
        id: "actions",
        cell: ({row}) => {
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Button variant={"ghost"}><EllipsisIcon/></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem>
                            <Link to={"/dashboard/object-type/$id"} params={{id: `${row.original.id}`}}>View Details</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Link to={"/dashboard/object-type/$id/edit"} params={{id: `${row.original.id}`}}>Edit</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={e => {
                            e.preventDefault()
                        }}>
                            <AlertDialog>
                                <AlertDialogTrigger>
                                    Delete
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you sure want to delete '{row.original.name}'?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laborum, perferendis!
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction>Delete</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        }
    }
]