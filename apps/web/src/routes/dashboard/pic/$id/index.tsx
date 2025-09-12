import {createFileRoute, Link, useNavigate} from '@tanstack/react-router'
import {useQuery} from "@tanstack/react-query";
import {GetEntityDetail} from "@/api/EntityDetail";
import {Skeleton} from "@/components/ui/skeleton";
import {Button} from "@/components/ui/button";
import {EditIcon, Trash} from "lucide-react";
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import type {Pic} from "@/types/pic";
import React from "react";
import {DataTable} from "@/components/data-table";
import {AuctionColumn} from "@/columns/auctionColumn";
import {useEntityDelete} from "@/hooks/use-entity-delete";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute('/dashboard/pic/$id/')({
    component: RouteComponent,
})

function RouteComponent() {
    const {id} = Route.useParams()
    const {data, isLoading, isFetching} = useQuery({
        queryKey: ["pic", id],
        queryFn: () => GetEntityDetail<Pic>({
            id: id,
            entityName: "pics"
        })
    })

    const {mutate, isPending} = useEntityDelete("pics")
    const navigate = useNavigate()

    return (
        <div className={"space-y-4"}>
            <div className="flex flex-col gap-4 md:gap-0 md:flex-row md:items-center justify-between">
                <h1 className="text-2xl font-semibold capitalize">{data?.content?.name}</h1>
                <div className="space-x-2">
                    <Link to={"/dashboard/object-type/$id/edit"} params={{id: id}}>
                        <Button>
                            <EditIcon/>
                            Edit
                        </Button>
                    </Link>
                    <AlertDialog>
                        <AlertDialogTrigger>
                            <Button variant={"outline"}>
                                <Trash/>
                            </Button>
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
                                    onClick={() => {
                                        mutate(
                                            {id: data!.content!.id.toString()},
                                            {
                                                onSuccess: () => navigate({to: "/dashboard/pic"})
                                            }
                                        )
                                    }}
                                    disabled={isPending}
                                >
                                    {isPending ? "Deleting..." : "Delete"}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>
            <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex text-sm font-medium capitalize space-x-1 items-center">
                    <span>Created at</span>
                    <span>:</span>
                    <span className="text-muted-foreground">{new Date(data?.content?.created_at!).toUTCString()}</span>
                </div>
                <div className="flex text-sm font-medium capitalize space-x-1 items-center">
                    <span>Updated at</span>
                    <span>:</span>
                    <span className="text-muted-foreground">{new Date(data?.content?.updated_at!).toUTCString()}</span>
                </div>
            </div>
            <div className="grid lg:grid-cols-2 gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle>
                            PIC Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-2">
                        <div>
                            <h2 className="text-sm font-medium capitalize">
                                Name
                            </h2>
                            <p className="line-clamp-4 text-justify text-muted-foreground">
                                {data?.content?.name}
                            </p>
                        </div>
                        <div>
                            <h2 className="text-sm font-medium capitalize">
                                Phone Number
                            </h2>
                            <p className="line-clamp-4 text-justify text-muted-foreground">
                                {data?.content?.phone_number}
                            </p>
                        </div>
                    </CardContent>
                </Card>
                <Skeleton/>
            </div>
            <div className={"col-span-2"}>
                <DataTable columns={AuctionColumn} data={data?.content?.auctions || []} usePagination={false}/>
            </div>
        </div>
    )
}
