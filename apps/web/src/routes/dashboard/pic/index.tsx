import {createFileRoute, useNavigate} from '@tanstack/react-router'
import {Button} from "@/components/ui/button";
import {PlusCircleIcon} from "lucide-react";
import {Skeleton} from "@/components/ui/skeleton";
import {GenericDataTable} from "@/components/generic-data-table";
import {PicColumn} from "@/columns/picColumn";
import type {Pic} from "@/types/pic";
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
import {useEntityCreate} from "@/hooks/use-entity-create";
import {useForm} from "@tanstack/react-form";
import {OrganizerSchema} from "@/schemas/organizerSchema";
import {PicSchema} from "@/schemas/picSchema";
import {FieldInfo} from "@/components/field-info";

export const Route = createFileRoute('/dashboard/pic/')({
    component: RouteComponent,
})

function RouteComponent() {
    const entity = "Pic"

    const {mutate} = useEntityCreate("pics");
    const form = useForm({
        defaultValues: {
            name: "",
            phone_number: "",
        },

        validators: {
            onChange: PicSchema,
        },

        onSubmit: async ({value}) => {
            console.log(value)
            mutate({data: value})
        },
    })

    return (
        <div className={"space-y-4"}>
            <div className="flex justify-between">
                <h1 className="text-2xl font-semibold tracking-wide capitalize">
                    {entity}
                </h1>
                <Sheet>
                    <SheetTrigger>
                        <Button className={"cursor-pointer capitalize"}>
                            <PlusCircleIcon/> Add {entity}
                        </Button>
                    </SheetTrigger>
                    <SheetContent>
                        <SheetHeader>
                            <SheetTitle>Add New {entity}</SheetTitle>
                            <SheetDescription>
                                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Earum fugit harum laboriosam nulla quis totam!
                            </SheetDescription>
                        </SheetHeader>

                        <form
                            id="pic-form"
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
                                name="phone_number"
                                children={(field) => (
                                    <div className="grid gap-3">
                                        <Label htmlFor={field.name} className={"capitalize"}>{field.name.split("_").join(" ")}</Label>
                                        <Input
                                            id={field.name}
                                            type={"number"}
                                            name={field.name}
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={(e) => field.handleChange(e.target.value as string)}
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
                                        form="pic-form"
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
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4].map(() => (<Skeleton className={"h-40 rounded-lg"}/>))}
            </div>
            <GenericDataTable<Pic>
                entity="pics"
                columns={PicColumn}
                debounceDelay={200}
                initialPageSize={10}
                defaultSortBy="id"
                currentEntity={entity}
            />
        </div>
    )
}
