import type {ColumnDef} from "@tanstack/react-table";
import {Button} from "@/components/ui/button"
import {ArrowUpRight, CornerUpRight, EllipsisIcon, SquareArrowOutUpRight} from "lucide-react";
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
import type {Auction} from "@/types/auction";
import {DateFormatter} from "@/utils/date-formatter";
import {useEntityDelete} from "@/hooks/use-entity-delete";

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
        cell: ({row}) => DateFormatter(row.original.end_date)
    },
    {
        accessorKey: "item.name",
        header: "Item",
        cell: ({row}) => (
            <Link className={"flex items-center gap-1"} to={"/dashboard/item/$id"} params={{id: row.original.item.id.toString()}}>
                {row.original.item.name}
                <SquareArrowOutUpRight size={12}/>
            </Link>
        )
    },
    {
        accessorKey: "organizer.name",
        header: "Organizer",
        cell: ({row}) => (
            <Link className={"flex items-center gap-1"} to={"/dashboard/organizer/$id"} params={{id: row.original.organizer.id.toString()}}>
                {row.original.organizer.name}
                <SquareArrowOutUpRight size={12}/>
            </Link>
        )
    },
    {
        accessorKey: "pic.name",
        header: "PIC",
        cell: ({row}) => (
            <Link className={"flex items-center gap-1"} to={"/dashboard/pic/$id"} params={{id: row.original.pic.id.toString()}}>
                {row.original.pic.name}
                <SquareArrowOutUpRight size={12}/>
            </Link>
        )
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
            const {mutate, isPending} = useEntityDelete("auctions")

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Button variant={"ghost"}><EllipsisIcon/></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem>
                            <Link to={"/dashboard/auction/$id"} params={{id: `${row.original.id}`}}>View Details</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Link to={"/dashboard/auction/$id/edit"} params={{id: `${row.original.id}`}}>Edit</Link>
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