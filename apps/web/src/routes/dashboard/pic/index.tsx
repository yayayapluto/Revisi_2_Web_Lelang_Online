import {createFileRoute, useNavigate} from '@tanstack/react-router'
import {Button} from "@/components/ui/button";
import {PlusCircleIcon} from "lucide-react";
import {Skeleton} from "@/components/ui/skeleton";
import {GenericDataTable} from "@/components/generic-data-table";
import {PicColumn} from "@/columns/picColumn";
import type {Pic} from "@/types/pic";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from "@/components/ui/sheet";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";

export const Route = createFileRoute('/dashboard/pic/')({
    component: RouteComponent,
})

function RouteComponent() {
    const entity = "Pic"
    const navigate = useNavigate()
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
                        <div className="grid flex-1 auto-rows-min gap-4 px-4">
                            <div className="grid gap-3">
                                <Label htmlFor="new-pic-name">Name</Label>
                                <Input id="new-pic-name" />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="new-pic-phoneNumber">Phone Number</Label>
                                <Input id="new-pic-phoneNumber" />
                            </div>
                        </div>
                        <SheetFooter>
                            <Button>Finish</Button>
                            <Button variant={"outline"}>Revert</Button>
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
