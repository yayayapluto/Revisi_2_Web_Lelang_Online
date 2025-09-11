import {createFileRoute, Link} from '@tanstack/react-router'
import {useQuery} from "@tanstack/react-query";
import {GetEntityDetail} from "@/api/EntityDetail";
import type {Auction} from "@/types/auction";
import React from "react";
import {
    Carousel,
    type CarouselApi,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious
} from "@/components/ui/carousel";
import {Button} from "@/components/ui/button";
import {EditIcon, SquareArrowOutUpRight, Trash} from "lucide-react";
import {Badge} from "@/components/ui/badge";
import {Tabs, TabsContent, TabsContents, TabsList, TabsTrigger} from "@/components/animate-ui/radix/tabs";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {DateFormatter} from "@/utils/date-formatter";

export const Route = createFileRoute('/dashboard/auction/$id/')({
    component: RouteComponent,
})

function RouteComponent() {
    const {id} = Route.useParams()
    const {data} = useQuery({
        queryKey: ["auction", id],
        queryFn: () => GetEntityDetail<Auction>({
            id: id,
            entityName: "auctions"
        })
    })

    const ITEM_THUMBNAILS = [
        data?.content?.item.file.path,
        ...(data?.content?.item.item_thumbnails?.map((t) => t.file.path) ?? [])
    ]
    console.log(ITEM_THUMBNAILS)

    const [api, setApi] = React.useState<CarouselApi>()
    const [current, setCurrent] = React.useState(0)
    const [count, setCount] = React.useState(0)

    React.useEffect(() => {
        if (!api) {
            return
        }

        setCount(api.scrollSnapList().length)
        setCurrent(api.selectedScrollSnap() + 1)

        api.on("select", () => {
            setCurrent(api.selectedScrollSnap() + 1)
        })
    }, [api])

    const auctionStatus = (
        new Date(data?.content?.start_date!) > new Date()
            ? "Up Coming"
            : new Date(data?.content?.start_date!) <= new Date() && new Date(data?.content?.end_date!) >= new Date()
                ? "On Going"
                : "Finished"
    )

    const auctionBadge = (auctionStatus === "Up Coming" ? "outline" : auctionStatus === "On Going" ? "default" : "secondary")

    const auction = data?.content
    const item = auction?.item
    const organizer = auction?.organizer
    const pic = auction?.pic

    const objectType = auction?.item.object_type

    const auctionDuration = Math.ceil(
        Math.abs(new Date(auction?.start_date!).getTime() - new Date(auction?.end_date!).getTime()) / (1000 * 60 * 60 * 24)
    )
    return (
        <div className={"space-y-4"}>
            <div className="flex flex-col gap-4 md:gap-0 md:flex-row md:items-center justify-between">
                <div className={"flex flex-row items-center gap-4"}>
                    <h1 className="text-2xl font-semibold capitalize">
                        {data?.content?.item.name}
                    </h1>
                    <Badge variant={auctionBadge}>
                        {auctionStatus}
                    </Badge>
                </div>
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
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
                <div className="flex items-center space-x-1.5">
                    <span className="font-medium">Object Type:</span>
                    <span className="text-muted-foreground">
                        <Link className={"flex items-center gap-1"} to={"/dashboard/object-type/$id"}
                              params={{id: objectType?.id.toString()!}}>
                            {objectType?.name}
                            <SquareArrowOutUpRight size={12}/>
                        </Link>
                    </span>
                </div>
                <div className="flex items-center space-x-1.5">
                    <span className="font-medium">Organizer:</span>
                    <span className="text-muted-foreground">
                        <Link className={"flex items-center gap-1"} to={"/dashboard/organizer/$id"}
                              params={{id: organizer?.id.toString()!}}>
                            {organizer?.name}
                            <SquareArrowOutUpRight size={12}/>
                        </Link>
                    </span>
                </div>
                <div className="flex items-center space-x-1.5">
                    <span className="font-medium">PIC Name:</span>
                    <span className="text-muted-foreground">
                        <Link className={"flex items-center gap-1"} to={"/dashboard/pic/$id"}
                              params={{id: pic?.id.toString()!}}>
                            {pic?.name}
                            <SquareArrowOutUpRight size={12}/>
                        </Link>
                    </span>
                </div>
                <div className="flex items-center space-x-1.5">
                    <span className="font-medium">PIC Contact:</span>
                    <span className="text-muted-foreground">
                        {data?.content?.pic.phone_number}
                    </span>
                </div>
            </div>
            <div className={"grid lg:grid-cols-6 gap-6"}>
                <div className="lg:col-span-2 w-full max-w-full overflow-x-hidden min-w-0">
                    <Carousel className={"w-full"} setApi={setApi}>
                        <CarouselContent>
                            {ITEM_THUMBNAILS.map((item, i) => (
                                <CarouselItem key={i}>
                                    <img
                                        src={item}
                                        loading="lazy"
                                        className="w-full h-auto aspect-square object-cover rounded"
                                        alt=""
                                    />
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious className="left-2"/>
                        <CarouselNext className="right-2"/>
                    </Carousel>
                    <Carousel className={"w-full mt-4"}>
                        <CarouselContent>
                            {ITEM_THUMBNAILS.map((item, i) => (
                                <CarouselItem className={"basis-1/5 md:basis-1/4"} onClick={() => api?.scrollTo(i)}>
                                    <img
                                        src={item}
                                        loading="lazy"
                                        className={`
                                    w-full h-auto aspect-square object-cover cursor-pointer rounded transition-opacity duration-300 ease-in-out
                                    ${current === (i + 1)
                                            ? 'opacity-100'
                                            : 'opacity-50 hover:opacity-75'
                                        }`}
                                        alt=""
                                    />
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                    </Carousel>
                </div>
                <div className="lg:col-span-4 w-full max-w-full min-w-0">
                    <div className={"space-y-4"}>
                        <div className={"grid lg:grid-cols-3 gap-4"}>
                            <Card>
                                <CardHeader>
                                    <CardTitle>
                                        Start Date
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {DateFormatter(auction?.start_date!)}
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle>
                                        End Date
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {DateFormatter(auction?.end_date!)}
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle>
                                        Duration
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {auctionDuration} Days
                                </CardContent>
                            </Card>
                        </div>
                        <Tabs defaultValue={"ItemDetailTab"} className={"top-16 sticky"}>
                            <TabsList className={"max-w-full overflow-x-auto whitespace-nowrap"}>
                                <TabsTrigger value="ItemDetailTab">Item Detail</TabsTrigger>
                                <TabsTrigger value="ItemDocumentTab">Item Document</TabsTrigger>
                                <TabsTrigger value="ItemGradeTab">Item Grade</TabsTrigger>
                                <TabsTrigger value="ObjectTypeTab">Object Type</TabsTrigger>
                                <TabsTrigger value="OrganizerTab">Organizer</TabsTrigger>
                                <TabsTrigger value="PicTab">PIC</TabsTrigger>
                            </TabsList>
                            <TabsContents>
                                <TabsContent value="ItemDetailTab">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>
                                                Item Details
                                            </CardTitle>
                                            <CardDescription>
                                                Detail information of item '{data?.content?.item.name}'
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className={"grid md:grid-cols-2 lg:grid-cols-3 gap-4"}>
                                                {item?.item_detail && Object.entries(item.item_detail!).map(([k, v]) => {
                                                    const skippedKeys = ["id", "created_at", "updated_at", "item_id"]
                                                    if (skippedKeys.includes(k, 0) || v === null) return
                                                    return (
                                                        <div>
                                                            <h1 className="text-md font-semibold capitalize">{k.split("_").join(" ")}</h1>
                                                            <p className={"line-clamp-4 truncate text-justify text-muted-foreground"}>{
                                                                (k === "stnk_date" ? DateFormatter(v, false) : v)
                                                            }</p>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                                <TabsContent value="ItemDocumentTab">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>
                                                Item Details
                                            </CardTitle>
                                            <CardDescription>
                                                Document information of item '{data?.content?.item.name}'
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className={"grid md:grid-cols-2 lg:grid-cols-3 gap-4"}>
                                                {item?.item_document && Object.entries(item.item_document!).map(([k, v]) => {
                                                    const skippedKeys = ["id", "created_at", "updated_at", "item_id"]
                                                    if (skippedKeys.includes(k, 0) || v === null) return
                                                    return (
                                                        <div>
                                                            <h1 className="text-md font-semibold capitalize">{k.split("_").join(" ")}</h1>
                                                            <p className={"line-clamp-4 truncate text-justify text-muted-foreground"}>{v ? "Yes" : "No"}</p>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                                <TabsContent value="ItemGradeTab">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>
                                                Item Details
                                            </CardTitle>
                                            <CardDescription>
                                                Grades of item '{data?.content?.item.name}'
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className={"grid md:grid-cols-2 lg:grid-cols-3 gap-4"}>
                                                {item?.item_grade && Object.entries(item.item_grade!).map(([k, v]) => {
                                                    const skippedKeys = ["id", "created_at", "updated_at", "item_id"]
                                                    if (skippedKeys.includes(k, 0) || v === null) return
                                                    return (
                                                        <div>
                                                            <h1 className="text-md font-semibold capitalize">{k.split("_").join(" ")}</h1>
                                                            <p className={"line-clamp-4 truncate text-justify text-muted-foreground capitalize"}>{v}</p>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                                <TabsContent value="OrganizerTab">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>
                                                Organizer
                                            </CardTitle>
                                            <CardDescription>
                                                Organizer Information
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className={"grid md:grid-cols-2 gap-4"}>
                                                {organizer && Object.entries(organizer!).map(([k, v]) => {
                                                    const skippedKeys = ["id", "created_at", "updated_at"]
                                                    if (skippedKeys.includes(k, 0) || v === null) return
                                                    return (
                                                        <div>
                                                            <h1 className="text-md font-semibold capitalize">{k.split("_").join(" ")}</h1>
                                                            <p className={"line-clamp-4 truncate text-justify text-muted-foreground capitalize"}>{v.toString()}</p>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                                <TabsContent value="ObjectTypeTab">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>
                                                Object Type
                                            </CardTitle>
                                            <CardDescription>
                                                Object Type Information
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className={"grid md:grid-cols-2 gap-4"}>
                                                {objectType && Object.entries(objectType!).map(([k, v]) => {
                                                    const skippedKeys = ["id", "created_at", "updated_at"]
                                                    if (skippedKeys.includes(k, 0) || v === null) return
                                                    return (
                                                        <div>
                                                            <h1 className="text-md font-semibold capitalize">{k.split("_").join(" ")}</h1>
                                                            <p className={"line-clamp-4 truncate text-justify text-muted-foreground capitalize"}>{v.toString()}</p>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                                <TabsContent value="PicTab">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>
                                                PIC
                                            </CardTitle>
                                            <CardDescription>
                                                PIC Information
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className={"grid md:grid-cols-2 gap-4"}>
                                                {pic && Object.entries(pic!).map(([k, v]) => {
                                                    const skippedKeys = ["id", "created_at", "updated_at"]
                                                    if (skippedKeys.includes(k, 0) || v === null) return
                                                    return (
                                                        <div>
                                                            <h1 className="text-md font-semibold capitalize">{k.split("_").join(" ")}</h1>
                                                            <p className={"line-clamp-4 truncate text-justify text-muted-foreground capitalize"}>{v.toString()}</p>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                            </TabsContents>
                        </Tabs>
                    </div>
                </div>
            </div>
        </div>
    )
}
