import {createFileRoute} from '@tanstack/react-router'
import {Button} from "@/components/ui/button";
import {Loader, PlusCircleIcon} from "lucide-react";
import {GenericDataTable} from "@/components/generic-data-table";
import type {ObjectType} from "@/types/objectType";
import {ObjectTypeColumn} from "@/columns/objectTypeColumn";
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
import {type AnyFieldApi, useForm} from "@tanstack/react-form";
import {z} from "zod";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {useEntityCreate} from "@/hooks/use-entity-create";
import {FieldInfo} from "@/components/field-info";

export const Route = createFileRoute('/dashboard/object-type/')({
    component: RouteComponent,
})

function RouteComponent() {
    const entity = "Object Type"
    const {mutate} = useEntityCreate("objectTypes");
    const form = useForm({
        defaultValues: {
            name: "",
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
                            id="objectType-form"
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

                            {/* hidden submit biar bisa di-trigger */}
                            <button type="submit" hidden />
                        </form>

                        {/* footer di luar form */}
                        <SheetFooter className="pt-4">
                            <form.Subscribe
                                selector={(state) => [state.canSubmit, state.isSubmitting]}
                                children={([canSubmit, isSubmitting]) => (
                                    <Button
                                        type="submit"
                                        form="objectType-form" // ⬅️ penting, nge-link ke form di atas
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

            <GenericDataTable<ObjectType>
                entity="objectTypes"
                columns={ObjectTypeColumn}
                debounceDelay={200}
                initialPageSize={10}
                defaultSortBy="id"
                currentEntity={entity}
            />
        </div>
    )
}