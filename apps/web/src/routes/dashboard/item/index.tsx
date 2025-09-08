import {createFileRoute, useNavigate} from '@tanstack/react-router'
import {Button} from "@/components/ui/button";
import {PlusCircleIcon} from "lucide-react";
import {Skeleton} from "@/components/ui/skeleton";
import {GenericDataTable} from "@/components/generic-data-table";
import {ItemColumn} from "@/columns/itemColumn";
import type {Item} from "@/types/item";

export const Route = createFileRoute('/dashboard/item/')({
    component: RouteComponent,
})

function RouteComponent() {
    const entity = "Item"
    const navigate = useNavigate()
    return (
        <div className={"space-y-4"}>
            <div className="flex justify-between">
                <h1 className="text-2xl font-semibold tracking-wide capitalize">
                    {entity}
                </h1>
                <Button className={"cursor-pointer capitalize"}
                        onClick={() => navigate({to: `${location.pathname.replace(`/list`, ``)}/create`})}>
                    <PlusCircleIcon/> Add {entity}</Button>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4].map(() => (<Skeleton className={"h-40 rounded-lg"}/>))}
            </div>
            <GenericDataTable<Item>
                entity="items"
                columns={ItemColumn}
                debounceDelay={200}
                initialPageSize={10}
                defaultSortBy="id"
                currentEntity={entity}
            />
        </div>
    )
}
