import type {ColumnDef} from "@tanstack/react-table";
import type {ObjectType} from "@/types/objectType";
import { Button } from "@/components/ui/button"
import {EllipsisIcon} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Link} from "@tanstack/react-router";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import {DataTableColumnHeader} from "@/components/data-table-column-header";
import type {Pic} from "@/types/pic";
import type {Auction} from "@/types/auction";
import {DateFormatter} from "@/utils/date-formatter";

export const AuctionColumn: ColumnDef<Auction>[] = [
    {
        accessorKey: "start_date",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title={"Start Date"}/>
        ),
        cell: ({row}) => DateFormatter(row.original.start_date)
    },
    {
        accessorKey: "end_date",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title={"End Date"}/>
        ),
        cell: ({row}) => DateFormatter(row.original.start_date)
    },
    {
        accessorKey: "item.name",
        header: "Item",
    },
    {
        accessorKey: "organizer.name",
        header: "Organizer",
    },
    {
        accessorKey: "pic.name",
        header: "PIC",
    },
    {
        accessorKey: "created_at",
        header: "Created At",
        cell: ({row}) => new Date(Date.parse(row.original.created_at)).toLocaleString(),
    },
    {
        accessorKey: "updated_at",
        header: "Updated At",
        cell: ({row}) => new Date(Date.parse(row.original.updated_at)).toLocaleString(),
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
                                        <AlertDialogTitle>Are you sure want to delete this auction?</AlertDialogTitle>
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