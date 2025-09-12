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
import {useEntityEdit} from "@/hooks/use-entity-edit";
import {useForm} from "@tanstack/react-form";
import {
    Sheet,
    SheetClose,
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
            const {mutate: mutateDelete, isPending} = useEntityDelete("organizers")
            const entity = "Organizer"
            const {mutate: mutateEdit} = useEntityEdit("organizers");
            const form = useForm({
                defaultValues: {
                    name: row.original.name ?? "",
                    address: row.original.address ?? "",
                    bank_name: row.original.bank_name ?? "",
                    account_number: row.original.account_number ?? "",
                    account_name: row.original.account_name ?? "",
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
                            <Link to={"/dashboard/organizer/$id"} params={{id: `${row.original.id}`}}>View
                                Details</Link>
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
                                        id="thisForm"
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
                                            name="address"
                                            validators={{
                                                onBlur: ({ value }) =>
                                                    !value
                                                        ? "A address is required"
                                                        : value.length < 3
                                                            ? "Address must be at least 3 characters"
                                                            : undefined,
                                            }}
                                            children={(field) => (
                                                <div className="grid gap-3">
                                                    <Label htmlFor={field.name}>Address</Label>
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
                                            name="bank_name"
                                            validators={{
                                                onBlur: ({ value }) =>
                                                    !value
                                                        ? "A bank name is required"
                                                        : value.length < 3
                                                            ? "Bank name must be at least 3 characters"
                                                            : undefined,
                                            }}
                                            children={(field) => (
                                                <div className="grid gap-3">
                                                    <Label htmlFor={field.name}>Bank Name</Label>
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
                                            name="account_number"
                                            validators={{
                                                onBlur: ({ value }) =>
                                                    !value
                                                        ? "A account number is required"
                                                        : value.length < 3
                                                            ? "Account number must be at least 3 characters"
                                                            : undefined,
                                            }}
                                            children={(field) => (
                                                <div className="grid gap-3">
                                                    <Label htmlFor={field.name}>Account number</Label>
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
                                            name="account_name"
                                            validators={{
                                                onBlur: ({ value }) =>
                                                    !value
                                                        ? "A account name is required"
                                                        : value.length < 3
                                                            ? "Account name must be at least 3 characters"
                                                            : undefined,
                                            }}
                                            children={(field) => (
                                                <div className="grid gap-3">
                                                    <Label htmlFor={field.name}>Account Name</Label>
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
                                                    form="thisForm"
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