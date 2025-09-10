import {createFileRoute} from '@tanstack/react-router'
import {Button} from "@/components/ui/button";
import {PlusCircleIcon} from "lucide-react";
import {GenericDataTable} from "@/components/generic-data-table";
import type {Organizer} from "@/types/organizer";
import {OrganizerColumn} from "@/columns/organizerColumn";
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
import {useForm} from "@tanstack/react-form";
import {z} from "zod";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {useEntityCreate} from "@/hooks/use-entity-create";
import {FieldInfo} from "@/components/field-info";
import {OrganizerSchema} from "@/schemas/organizerSchema";


export const Route = createFileRoute('/dashboard/organizer/')({
    component: RouteComponent,
})

function RouteComponent() {
    const entity = "Organizer"
    const {mutate} = useEntityCreate("organizers");
    const form = useForm({
        defaultValues: {
            name: "",
            address: "",
            bank_name: "",
            account_number: "",
            account_name: "",
        },

        validators: {
            onChange: OrganizerSchema,
        },

        onSubmit: async ({value}) => {
            mutate({data: value})
        },
    })

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold tracking-wide capitalize">
                    {entity}
                </h1>
                <Sheet>
                    <SheetTrigger asChild>
                        <Button className="capitalize">
                            <PlusCircleIcon className="mr-2 h-4 w-4"/> Add {entity}
                        </Button>
                    </SheetTrigger>
                    <SheetContent>
                        <SheetHeader>
                            <SheetTitle>Add New {entity}</SheetTitle>
                            <SheetDescription>
                                Fill in the details for a new {entity}.
                            </SheetDescription>
                        </SheetHeader>

                        <form
                            id="organizer-form"
                            onSubmit={e => {
                                e.preventDefault()
                                e.stopPropagation()
                                form.handleSubmit()
                            }}
                            className="grid flex-1 auto-rows-min gap-4 py-4 px-4"
                        >
                            <form.Field
                                name="name"
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
                                        <FieldInfo field={field}/>
                                    </div>
                                )}
                            />

                            <form.Field
                                name="address"
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
                                        <FieldInfo field={field}/>
                                    </div>
                                )}
                            />

                            <form.Field
                                name="bank_name"
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
                                        <FieldInfo field={field}/>
                                    </div>
                                )}
                            />

                            <form.Field
                                name="account_number"
                                children={(field) => (
                                    <div className="grid gap-3">
                                        <Label htmlFor={field.name}>Account Number</Label>
                                        <Input
                                            id={field.name}
                                            name={field.name}
                                            value={field.state.value}
                                            type={"number"}
                                            onBlur={field.handleBlur}
                                            onChange={(e) => field.handleChange(e.target.value  as string)}
                                        />
                                        <FieldInfo field={field}/>
                                    </div>
                                )}
                            />

                            <form.Field
                                name="account_name"
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
                                        <FieldInfo field={field}/>
                                    </div>
                                )}
                            />

                            <button type="submit" hidden/>
                        </form>

                        <SheetFooter className="pt-4">
                            <form.Subscribe
                                selector={(state) => [state.canSubmit, state.isSubmitting]}
                                children={([canSubmit, isSubmitting]) => (
                                    <Button
                                        type="submit"
                                        form="organizer-form"
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
            </div>

            <GenericDataTable<Organizer>
                entity="organizers"
                columns={OrganizerColumn}
                debounceDelay={200}
                initialPageSize={10}
                defaultSortBy="id"
                currentEntity={entity}
            />
        </div>
    )
}