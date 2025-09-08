import {createFileRoute, useNavigate} from '@tanstack/react-router'
import {Button} from "@/components/ui/button";
import {PlusCircleIcon} from "lucide-react";
import {Skeleton} from "@/components/ui/skeleton";
import {GenericDataTable} from "@/components/generic-data-table";
import {OrganizerColumn} from "@/columns/organizerColumn";
import type {Organizer} from "@/types/organizer";
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

export const Route = createFileRoute('/dashboard/organizer/')({
    component: RouteComponent,
})

function RouteComponent() {
    const entity = "Organizer"
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
                                <Label htmlFor="new-organizer-name">Name</Label>
                                <Input id="new-organizer-name" />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="new-organizer-address">Address</Label>
                                <Input id="new-organizer-address" />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="new-organizer-bankName">Bank Name</Label>
                                <Input id="new-organizer-bankName" />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="new-organizer-accountNumber">Account Number</Label>
                                <Input id="new-organizer-accountNumber" />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="new-organizer-accountName">Account Name</Label>
                                <Input id="new-organizer-accountName" />
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
