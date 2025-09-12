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
import type {Pic} from "@/types/pic";
import {useEntityDelete} from "@/hooks/use-entity-delete";
import {useEntityEdit} from "@/hooks/use-entity-edit";
import {useForm} from "@tanstack/react-form";
import {
    Sheet, SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from "@/components/ui/sheet";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {FieldInfo} from "@/components/field-info";

export const PicColumn: ColumnDef<Pic>[] = [
    {
        accessorKey: "name",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title={"Name"}/>
        ),
    },
    {
        accessorKey: "auctions",
        header: "Auction Count",
        cell: ({row}) => row.original.auctions.length,
    },
    {
        accessorKey: "phone_number",
        header: "Phone Number"
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
            const {mutate: mutateDelete, isPending} = useEntityDelete("pics")

            const entity = "Organizer"
            const {mutate: mutateEdit} = useEntityEdit("pics");
            const form = useForm({
                defaultValues: {
                    name: row.original.name ?? "",
                    phone_number: row.original.phone_number ?? ""
                },
                onSubmit: async ({value}) => {
                    mutateEdit({data: value, id: row.original.id})
                },
            })

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Button variant={"ghost"}><EllipsisIcon/></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem>
                            <Link to={"/dashboard/pic/$id"} params={{id: `${row.original.id}`}}>View Details</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={e => e.preventDefault()}>
                            <Sheet>
                                <SheetTrigger>
                                    Edit
                                </SheetTrigger>
                                <SheetContent>
                                    <SheetHeader>
                                        <SheetTitle>Edit {entity}</SheetTitle>
                                        <SheetDescription>
                                            Fill in the details for a new {entity}.
                                        </SheetDescription>
                                    </SheetHeader>

                                    <form
                                        id="this-form"
                                        onSubmit={e => {
                                            e.preventDefault()
                                            e.stopPropagation()
                                            form.handleSubmit()
                                        }}
                                        className="grid flex-1 auto-rows-min gap-4 py-4 px-4"
                                    >
                                        <form.Field
                                            name="name"
                                            validators={{
                                                onBlur: ({ value }) =>
                                                    !value
                                                        ? "A name is required"
                                                        : value.length < 3
                                                            ? "Name must be at least 3 characters"
                                                            : undefined,
                                            }}
                                            children={(field) => (
                                                <div className="grid gap-3">
                                                    <Label htmlFor={field.name}>Name</Label>
                                                    <Input
                                                        id={field.name}
                                                        name={field.name}
                                                        value={field.state.value}
                                                        onBlur={field.handleBlur}
                                                        onChange={(e) => field.handleChange(e.target.value)}
                                                    />
                                                    <FieldInfo field={field} />
                                                </div>
                                            )}
                                        />

                                        <form.Field
                                            name="phone_number"
                                            validators={{
                                                onBlur: ({ value }) =>
                                                    !value
                                                        ? "A phone number is required"
                                                        : value.length < 3
                                                            ? "Phone number must be at least 3 characters"
                                                            : undefined,
                                            }}
                                            children={(field) => (
                                                <div className="grid gap-3">
                                                    <Label htmlFor={field.name}>Phone Number</Label>
                                                    <Input
                                                        id={field.name}
                                                        name={field.name}
                                                        value={field.state.value}
                                                        onBlur={field.handleBlur}
                                                        onChange={(e) => field.handleChange(e.target.value)}
                                                    />
                                                    <FieldInfo field={field} />
                                                </div>
                                            )}
                                        />

                                        <button type="submit" hidden />
                                    </form>

                                    <SheetFooter className="pt-4">
                                        <form.Subscribe
                                            selector={(state) => [state.canSubmit, state.isSubmitting]}
                                            children={([canSubmit, isSubmitting]) => (
                                                <Button
                                                    type="submit"
                                                    form="this-form"
                                                    disabled={!canSubmit}
                                                >
                                                    {isSubmitting ? "..." : "Submit"}
                                                </Button>
                                            )}
                                        />
                                        <SheetClose asChild>
                                            <Button variant="outline" type="button">
                                                Cancel
                                            </Button>
                                        </SheetClose>
                                    </SheetFooter>
                                </SheetContent>

                            </Sheet>
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
                                            onClick={() => mutateDelete({id: row.original.id})}
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