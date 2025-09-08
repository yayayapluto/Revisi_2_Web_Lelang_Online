import type {ColumnDef} from "@tanstack/react-table";
import {Button} from "@/components/ui/button"
import {EllipsisIcon} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
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
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import {DataTableColumnHeader} from "@/components/data-table-column-header";
import type {Organizer} from "@/types/organizer";
import {useEntityDelete} from "@/hooks/use-entity-delete";

export const OrganizerColumn: ColumnDef<Organizer>[] = [
    {
        accessorKey: "name",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title={"Name"}/>
        ),
    },
    {
        accessorKey: "auctions",
        header: "Total Auctions",
        cell: ({row}) => row.original.auctions.length,
    },
    {
        accessorKey: "address",
        header: "Address",
    },
    {
        accessorKey: "bank_name",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title={"Bank Name"}/>
        ),
    },
    {
        accessorKey: "account_number",
        header: "Account Number",
    },
    {
        accessorKey: "account_name",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title={"Account Name"}/>
        ),
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
            const {mutate, isPending} = useEntityDelete("organizers")

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Button variant={"ghost"}><EllipsisIcon/></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem>
                            <Link to={"/dashboard/organizer/$id"} params={{id: `${row.original.id}`}}>View
                                Details</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Link to={"/dashboard/organizer/$id/edit"} params={{id: `${row.original.id}`}}>Edit</Link>
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
                                        <AlertDialogTitle>Are you sure want to delete
                                            '{row.original.name}'?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laborum,
                                            perferendis!
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={() => mutate({id: row.original.id})}
                                            disabled={isPending}
                                        >
                                            {isPending ? "Deleting..." : "Delete"}
                                        </AlertDialogAction>
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