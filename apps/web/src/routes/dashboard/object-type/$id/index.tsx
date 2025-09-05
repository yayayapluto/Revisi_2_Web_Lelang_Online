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
import {ItemColumn} from "@/columns/itemColumn";
import {getCoreRowModel, getPaginationRowModel, getSortedRowModel, useReactTable} from "@tanstack/react-table";
import {CurrencyFormatter} from "@/utils/currency-formatter";

export const Route = createFileRoute('/dashboard/object-type/$id/')({
    component: RouteComponent,
})

function RouteComponent() {
    const {id} = Route.useParams()
    const {data, isLoading, isFetching} = useQuery({
        queryKey: ["object-type", id],
        queryFn: () => GetEntityDetail<ObjectType>({
            id: id,
            entityName: "objectTypes"
        })
    })

    const CARD_DATA = [
        {
            title: "Highest Price",
            value: data?.content?.items
                ?.sort((a, b) => b.price - a.price)[0],
        },
        {
            title: "Lowest Price",
            value: data?.content?.items
                ?.sort((a, b) => a.price - b.price)[0],
        },
        {
            title: "Average Price",
            value: data?.content?.items
                ? data.content.items.reduce((prev, val) => prev + val.price, 0) /
                data.content.items.length
                : 0,
        },
        {
            title: "Total Deposit Price",
            value: data?.content?.items
                ? data.content.items.reduce((prev, val) => prev + val.deposit_price, 0)
                : 0,
        },
    ]

    const chartData = data?.content?.items?.sort((a, b) => b.price - a.price).map(item => ({
        name: item.name,
        value: item.price,
    })) ?? []

    const chartConfig = {
        name: {
            label: "Name",
            color: "blue",
        },
    } satisfies ChartConfig

    const itemTable = useReactTable({
        data: data?.content?.items!,
        columns: ItemColumn,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
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
                <div className="col-span-6 grid gap-4 lg:grid-cols-4">
                    {CARD_DATA.map((data) => {
                        return (
                            <Card>
                                <CardHeader>
                                    <CardDescription>
                                        {data.title}
                                    </CardDescription>
                                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                                        {CurrencyFormatter(typeof data?.value === "number"
                                            ? data?.value
                                            : data?.value?.price ?? 0)}
                                    </CardTitle>
                                    <CardAction>
                                        {
                                            typeof data?.value === "number"
                                                ? <></>
                                                : (
                                                    <Link to={"/dashboard"} params={{id: data?.value?.id?.toString()!}}>
                                                        <Button variant={"link"}>
                                                            See Details
                                                            <ArrowUpRight/>
                                                        </Button>
                                                    </Link>
                                                )
                                        }
                                    </CardAction>
                                </CardHeader>
                                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                                    <div className="line-clamp-1 flex gap-2 font-medium">
                                        Current {data.title}
                                    </div>
                                    <div className="text-muted-foreground">
                                        {
                                            typeof data?.value !== "number" ? (
                                                <>Item Name: {data?.value?.name ?? "-"}</>
                                            ) : (
                                                <>-</>
                                            )
                                        }
                                    </div>
                                </CardFooter>
                            </Card>
                        )
                    })}
                </div>
                <div className="col-span-6 grid lg:grid-cols-2 gap-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Item Chart</CardTitle>
                            <CardDescription>Highest to lowest by price</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer config={chartConfig}>
                                <BarChart
                                    accessibilityLayer
                                    data={chartData}
                                    margin={{
                                        top: 20,
                                    }}
                                >
                                    <CartesianGrid vertical={false}/>
                                    <XAxis
                                        dataKey="name"
                                        tickLine={false}
                                        tickMargin={10}
                                        axisLine={false}
                                    />
                                    <ChartTooltip
                                        cursor={true}
                                        content={<ChartTooltipContent/>}
                                    />
                                    <Bar dataKey="value" fill="oklch(87% 0 0)" radius={8}>
                                        <LabelList
                                            position="top"
                                            offset={10}
                                            className="fill-foreground hidden lg:block"
                                            fontSize={12}
                                            formatter={(value: number) => CurrencyFormatter(value)}
                                        />
                                    </Bar>
                                </BarChart>
                            </ChartContainer>
                        </CardContent>
                        <CardFooter className="flex-col items-start gap-2 text-sm">
                            <div className="flex gap-2 leading-none font-medium">
                                Trending up by 5.2% this month <TrendingUp className="h-4 w-4"/>
                            </div>
                            <div className="text-muted-foreground leading-none">
                                Showing total visitors for the last 6 months
                            </div>
                        </CardFooter>
                    </Card>
                    <Skeleton className={"w-full flex items-center justify-center"}>
                        Chart untuk lelang dengan tipe objek ini
                    </Skeleton>
                </div>
                <div className="col-span-6 space-y-2">
                    <h1 className="text-xl font-semibold">Items List</h1>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {data?.content?.items!.map((item) => {
                            return (
                                <Card>
                                    <CardHeader>
                                        <img className={"rounded-sm size-full"} src={item.file.path} alt=""/>
                                        <CardTitle className={"capitalize"}>
                                            {item.name}
                                        </CardTitle>
                                        <CardDescription className={"grid grid-cols-2 w-full"}>
                                            <p>(Deposit)</p>
                                            <p className={"text-end"}>{CurrencyFormatter(item.deposit_price)}</p>
                                            <p>(Price)</p>
                                            <p className={"text-end"}>{CurrencyFormatter(item.price)}</p>
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <p className={"text-justify line-clamp-3 "}>{item.description} Lorem
                                            ipsum dolor sit amet, consectetur adipisicing elit. Aspernatur consectetur
                                            culpa cumque cupiditate, dolores eius expedita illo ipsam, mollitia nemo
                                            numquam officiis quae qui quisquam velit! Commodi, est magni nemo
                                            perferendis porro quaerat recusandae temporibus totam voluptatum. Cum
                                            distinctio, error explicabo incidunt neque similique suscipit. Cumque
                                            dignissimos modi quibusdam quidem?</p>
                                    </CardContent>
                                    <CardFooter>
                                        <Button variant={"outline"} className={"w-full"}>
                                            See Details
                                        </Button>
                                    </CardFooter>
                                </Card>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}
