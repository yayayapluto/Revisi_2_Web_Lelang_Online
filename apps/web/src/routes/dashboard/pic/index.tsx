import {createFileRoute, useNavigate} from '@tanstack/react-router'
import {Button} from "@/components/ui/button";
import {PlusCircleIcon} from "lucide-react";
import {Skeleton} from "@/components/ui/skeleton";
import {GenericDataTable} from "@/components/generic-data-table";
import type {ObjectType} from "@/types/objectType";
import {ObjectTypeColumn} from "@/columns/objectTypeColumn";
import {OrganizerColumn} from "@/columns/organizerColumn";
import type {Organizer} from "@/types/organizer";
import {PicColumn} from "@/columns/picColumn";
import type {Pic} from "@/types/pic";

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
                <Button className={"cursor-pointer capitalize"}
                        onClick={() => navigate({to: `${location.pathname}/create`})}>
                    <PlusCircleIcon/> Add {entity}</Button>
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
