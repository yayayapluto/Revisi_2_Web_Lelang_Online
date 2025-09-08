import {createFileRoute, Link} from '@tanstack/react-router'
import {useQuery} from '@tanstack/react-query'
import {GetEntityDetail} from '@/api/EntityDetail'
import {Button} from '@/components/ui/button'
import {EditIcon, Trash} from 'lucide-react'
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,} from '@/components/ui/card'
import {type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent,} from '@/components/ui/chart'
import type {Organizer} from '@/types/organizer'
import React from 'react'
import {
    Bar,
    BarChart,
    CartesianGrid,
    LabelList,
    Line,
    LineChart,
    PolarAngleAxis,
    PolarGrid,
    Radar,
    RadarChart,
    ResponsiveContainer,
    XAxis
} from "recharts";
import {DataTable} from "@/components/data-table";
import {AuctionColumn} from "@/columns/auctionColumn";

export const Route = createFileRoute('/dashboard/organizer/$id/')({
    component: RouteComponent,
})

function RouteComponent() {
    const {id} = Route.useParams()
    const {data} = useQuery({
        queryKey: ['organizer', id],
        queryFn: () =>
            GetEntityDetail<Organizer>({
                id,
                entityName: 'organizers',
            }),
    })

    const auctions = data?.content?.auctions || []

    const auctionStatusChartData = [
        {
            type: 'Upcoming',
            total:
                data?.content?.auctions.filter(
                    (auction) => new Date(auction.start_date) > new Date()
                ).length || 0,
        },
        {
            type: 'Ongoing',
            total:
                data?.content?.auctions.filter(
                    (auction) =>
                        new Date(auction.start_date) <= new Date() &&
                        new Date(auction.end_date) >= new Date()
                ).length || 0,
        },
        {
            type: 'Finished',
            total:
                data?.content?.auctions.filter(
                    (auction) => new Date(auction.end_date) < new Date()
                ).length || 0,
        },
    ]
    const auctionStatusChartConfig = {
        Upcoming: {
            label: 'Upcoming',
        },
        Ongoing: {
            label: 'Ongoing',
        },
        Finished: {
            label: 'Finished',
        },
    } satisfies ChartConfig

    const objectTypeCounts = auctions.reduce<Record<string, number>>((acc, auction) => {
        const objectTypeName = auction.item.object_type.name
        if (!objectTypeName) return acc
        acc[objectTypeName] = (acc[objectTypeName] || 0) + 1
        return acc
    }, {})
    const objectTypeChartData = Object.entries(objectTypeCounts).map(([name, count]) => ({
        type: name,
        total: count,
    }));
    const objectTypeChartConfig = Object.fromEntries(
        Object.entries(objectTypeCounts).map(([name, _], index) => [
            name,
            {
                label: name,
            },
        ])
    ) satisfies ChartConfig;

    const PICCounts = auctions.reduce<Record<string, number>>((acc, auction) => {
        const PICName = auction.pic.name
        if (!PICName) return acc
        acc[PICName] = (acc[PICName] || 0) + 1
        return acc
    }, {})
    const PICChartData = Object.entries(PICCounts).map(([name, count]) => ({
        name: name,
        total: count,
    }));
    const PICChartConfig = Object.fromEntries(
        Object.entries(objectTypeCounts).map(([name, _], index) => [
            name,
            {
                label: name,
            },
        ])
    ) satisfies ChartConfig;

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:gap-0 md:flex-row md:items-center justify-between">
                <h1 className="text-2xl font-semibold capitalize">
                    {data?.content?.name}
                </h1>
                <div className="space-x-2">
                    <Link to="/dashboard/object-type/$id/edit" params={{id}}>
                        <Button>
                            <EditIcon className="mr-2 h-4 w-4"/>
                            Edit
                        </Button>
                    </Link>
                    <Button variant="outline">
                        <Trash className="h-4 w-4"/>
                    </Button>
                </div>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-6 text-sm">
                <div className="flex items-center space-x-1.5">
                    <span className="font-medium">Created at:</span>
                    <span className="text-muted-foreground">
            {data?.content?.created_at
                ? new Date(data.content.created_at).toLocaleString()
                : '—'}
          </span>
                </div>
                <div className="flex items-center space-x-1.5">
                    <span className="font-medium">Updated at:</span>
                    <span className="text-muted-foreground">
            {data?.content?.updated_at
                ? new Date(data.content.updated_at).toLocaleString()
                : '—'}
          </span>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-6">
                <Card className="lg:col-span-3 overflow-x-auto">
                    <CardHeader>
                        <CardTitle>Organizer Details</CardTitle>
                        <CardDescription>
                            Comprehensive information about this organizer
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        {data?.content &&
                            Object.entries(data.content).map(([key, value]) => {
                                const skippedKeys = [
                                    'id',
                                    'auctions',
                                    'bank_name',
                                    'account_number',
                                    'account_name',
                                    'created_at',
                                    'updated_at',
                                ]
                                if (skippedKeys.includes(key) || value === null) return null

                                return (
                                    <div key={key}>
                                        <h2 className="text-sm font-medium capitalize">
                                            {key.split('_').join(' ')}
                                        </h2>
                                        <p className="line-clamp-4 text-justify text-muted-foreground">
                                            {typeof value !== 'object' && value}
                                        </p>
                                    </div>
                                )
                            })}
                    </CardContent>
                </Card>
                <Card className="lg:col-span-3 overflow-x-auto">
                    <CardHeader>
                        <CardTitle>Bank Information</CardTitle>
                        <CardDescription>Linked financial account details</CardDescription>
                    </CardHeader>
                    <CardContent className="grid md:grid-cols-2 gap-4">
                        {data?.content &&
                            Object.entries(data.content).map(([key, value]) => {
                                const skippedKeys = [
                                    'id',
                                    'auctions',
                                    'name',
                                    'address',
                                    'created_at',
                                    'updated_at',
                                ]
                                if (skippedKeys.includes(key) || value === null) return null

                                return (
                                    <div key={key}>
                                        <h2 className="text-sm font-medium capitalize">
                                            {key.split('_').join(' ')}
                                        </h2>
                                        <p className="line-clamp-4 text-justify text-muted-foreground">
                                            {typeof value !== 'object' && value}
                                        </p>
                                    </div>
                                )
                            })}
                    </CardContent>
                </Card>

                <Card className="lg:col-span-3 overflow-x-auto">
                    <CardHeader>
                        <CardTitle>Bar Chart - Label</CardTitle>
                        <CardDescription>January - June 2024</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={auctionStatusChartConfig}>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart
                                    accessibilityLayer
                                    data={auctionStatusChartData}
                                    margin={{
                                        top: 20,
                                    }}
                                >
                                    <CartesianGrid vertical={false}/>
                                    <XAxis
                                        dataKey="type"
                                        tickLine={false}
                                        tickMargin={10}
                                        axisLine={false}
                                    />
                                    <ChartTooltip
                                        cursor={true}
                                        content={<ChartTooltipContent/>}
                                    />
                                    <Bar dataKey="total" fill="var(--chart-1)" radius={8}>
                                        <LabelList
                                            position="top"
                                            offset={12}
                                            className="fill-foreground"
                                            fontSize={12}
                                        />
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>
                    <CardFooter className="flex-col items-start gap-2 text-sm">
                        <div className="text-muted-foreground leading-none">
                            Showing total auction by status
                        </div>
                    </CardFooter>
                </Card>
                <Card className="lg:col-span-3 overflow-x-auto">
                    <CardHeader className="items-center pb-4">
                        <CardTitle>Radar Chart</CardTitle>
                        <CardDescription>
                            Showing total visitors for the last 6 months
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-0">
                        <ChartContainer
                            config={PICChartConfig}
                            className="mx-auto aspect-square max-h-[450px]"
                        >
                            <ResponsiveContainer width="100%" height={300}>
                                <RadarChart data={PICChartData}>
                                    <ChartTooltip cursor={false} content={<ChartTooltipContent/>}/>
                                    <PolarAngleAxis dataKey="name"/>
                                    <PolarGrid/>
                                    <Radar
                                        dataKey="total"
                                        fill="var(--chart-1)"
                                        fillOpacity={0.6}
                                    />
                                </RadarChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>
                    <CardFooter className="flex-col gap-2 text-sm">
                        <div className="text-muted-foreground flex items-center gap-2 leading-none">
                            January - June 2024
                        </div>
                    </CardFooter>
                </Card>
                <Card className="lg:col-span-6 overflow-x-auto">
                    <CardHeader>
                        <CardTitle>Line Chart - Custom Label</CardTitle>
                        <CardDescription>January - June 2024</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={objectTypeChartConfig}>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart
                                    accessibilityLayer
                                    data={objectTypeChartData}
                                    margin={{
                                        top: 24,
                                        left: 24,
                                        right: 24,
                                    }}
                                >
                                    <CartesianGrid vertical={false}/>
                                    <ChartTooltip
                                        cursor={false}
                                        content={
                                            <ChartTooltipContent
                                                indicator="line"
                                                nameKey="type"
                                                hideLabel
                                            />
                                        }
                                    />
                                    <Line
                                        dataKey="total"
                                        type="natural"
                                        stroke="var(--chart-1)"
                                        strokeWidth={2}
                                        dot={{
                                            fill: "var(--chart-1)",
                                        }}
                                        activeDot={{
                                            r: 6,
                                        }}
                                    >
                                        <LabelList
                                            position="top"
                                            offset={12}
                                            className="fill-foreground"
                                            fontSize={12}
                                            dataKey="type"
                                            formatter={(value: keyof typeof objectTypeChartConfig) =>
                                                objectTypeChartConfig[value]?.label
                                            }
                                        />
                                    </Line>
                                </LineChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>
                    <CardFooter className="flex-col items-start gap-2 text-sm">
                        <div className="text-muted-foreground leading-none">
                            Showing total visitors for the last 6 months
                        </div>
                    </CardFooter>
                </Card>

                <div className="lg:col-span-6 overflow-x-auto">
                    <DataTable columns={AuctionColumn} data={auctions} usePagination={false}/>
                </div>
            </div>
        </div>
    )
}