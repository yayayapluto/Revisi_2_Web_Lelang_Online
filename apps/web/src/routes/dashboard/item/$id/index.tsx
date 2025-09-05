import {createFileRoute, Link} from '@tanstack/react-router'
import {useQuery} from "@tanstack/react-query";
import {GetEntityDetail} from "@/api/EntityDetail";
import type {ObjectType} from "@/types/objectType";
import {Skeleton} from "@/components/ui/skeleton";
import {Button} from "@/components/ui/button";
import {ArrowUpRight, EditIcon, Trash, TrendingUp} from "lucide-react";
import {Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from '@/components/ui/card';
import {type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent} from "@/components/ui/chart";
import {Bar, BarChart, CartesianGrid, LabelList, XAxis} from 'recharts';
import {getCoreRowModel, getPaginationRowModel, getSortedRowModel, useReactTable} from "@tanstack/react-table";
import {CurrencyFormatter} from "@/utils/currency-formatter";
import type {Item} from "@/types/item";

export const Route = createFileRoute('/dashboard/item/$id/')({
    component: RouteComponent,
})

function RouteComponent() {
    const {id} = Route.useParams()
    const {data} = useQuery({
        queryKey: ["items", id],
        queryFn: () => GetEntityDetail<Item>({
            id: id,
            entityName: "items"
        })
    })

    return (
        <div className={"space-y-4"}>
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold capitalize">{data?.content?.name}</h1>
                <div className="space-x-2">
                    <Link to={"/dashboard/object-type/$id/edit"} params={{id: id}}>
                        <Button>
                            <EditIcon/>
                            Edit
                        </Button>
                    </Link>
                    <Button variant={"outline"}><Trash/></Button>
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
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
                <div className="col-span-2 w-full flex items-center justify-center">
                    <img src={data?.content?.file.path} loading={"lazy"} className={"size-full"} alt=""/>
                </div>
                <div className="col-span-4 space-y-4">
                    <Card>
                        {/*<CardHeader>*/}
                        {/*    <CardTitle>Card Title</CardTitle>*/}
                        {/*    <CardDescription>Card Description</CardDescription>*/}
                        {/*    <CardAction>Card Action</CardAction>*/}
                        {/*</CardHeader>*/}
                        <CardContent className={"space-y-4"}>
                            <div className="space-y-1">
                                <h1 className="text-lg font-semibold">Deposit Price</h1>
                                <p className={"line-clamp-4 truncate text-justify text-muted-foreground"}>{CurrencyFormatter(data?.content?.deposit_price!)}</p>
                            </div>
                            <div className="space-y-1">
                                <h1 className="text-lg font-semibold">Price</h1>
                                <p className={"line-clamp-4 truncate text-justify text-muted-foreground"}>{CurrencyFormatter(data?.content?.price!)}</p>
                            </div>
                            <div className="space-y-1">
                                <h1 className="text-lg font-semibold">Description</h1>
                                <p className={"line-clamp-4 truncate text-justify text-muted-foreground"}>{data?.content?.description}</p>
                            </div>
                        </CardContent>
                        {/*<CardFooter>*/}
                        {/*    <p>Card Footer</p>*/}
                        {/*</CardFooter>*/}
                    </Card>
                </div>
            </div>
        </div>
    )
}
