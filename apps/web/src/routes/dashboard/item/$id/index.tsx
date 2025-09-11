import {createFileRoute, Link} from '@tanstack/react-router'
import {useQuery} from "@tanstack/react-query";
import {GetEntityDetail} from "@/api/EntityDetail";
import {Button} from "@/components/ui/button";
import {EditIcon, Trash} from "lucide-react";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {CurrencyFormatter} from "@/utils/currency-formatter";
import type {Item} from "@/types/item";
import {DateFormatter} from "@/utils/date-formatter";
import {
    Carousel,
    type CarouselApi,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious
} from "@/components/ui/carousel";
import React from "react";

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

    const ITEM_THUMBNAILS = [
        data?.content?.file?.path,
        ...(data?.content?.item_thumbnails?.map((t) => t.file.path) ?? []),
    ];

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

    return (
        <div className={"space-y-4"}>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6 items-start">
                <div className="md:col-span-2 sticky lg:top-20">
                    <Carousel className="relative" setApi={setApi}>
                        <CarouselContent>
                            {ITEM_THUMBNAILS.map((item, i) => (
                                <CarouselItem key={i}>
                                    <img
                                        src={item}
                                        loading="lazy"
                                        className="size-full aspect-square object-cover rounded"
                                        alt=""
                                    />
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious className="left-2"/>
                        <CarouselNext className="right-2"/>
                    </Carousel>
                    <Carousel className={"mt-4"}>
                        <CarouselContent>
                            {ITEM_THUMBNAILS.map((item, i) => (
                                <CarouselItem className={"basis-1/4 md:basis-1/3"} onClick={() => api?.scrollTo(i)}>
                                    <img
                                        src={item}
                                        loading="lazy"
                                        className={`
                                    size-full aspect-square object-cover rounded cursor-pointer transition-opacity duration-300 ease-in-out
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

                <div className="md:col-span-4 space-y-4">
                    <div className="flex flex-col gap-4 md:gap-0 md:flex-row md:items-center justify-between">
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
                            <span
                                className="text-muted-foreground">{new Date(data?.content?.created_at!).toUTCString()}</span>
                        </div>
                        <div className="flex text-sm font-medium capitalize space-x-1 items-center">
                            <span>Updated at</span>
                            <span>:</span>
                            <span
                                className="text-muted-foreground">{new Date(data?.content?.updated_at!).toUTCString()}</span>
                        </div>
                    </div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Information</CardTitle>
                            <CardDescription>Quick information of item'{data?.content?.name}'</CardDescription>
                            {/*<CardAction>Card Action</CardAction>*/}
                        </CardHeader>
                        <CardContent className={"grid lg:grid-cols-2 gap-4"}>
                            {
                                [
                                    {
                                        name: "Deposit Price",
                                        value: CurrencyFormatter(data?.content?.deposit_price!)
                                    },
                                    {
                                        name: "Price",
                                        value: CurrencyFormatter(data?.content?.price!)
                                    },
                                    {
                                        name: "Object Type",
                                        value: data?.content?.object_type.name
                                    },
                                    {
                                        name: "Description",
                                        value: data?.content?.description
                                    },
                                ].map((item) => (
                                    <div className={`${item.name === "Description" && "lg:col-span-2"}`}>
                                        <h1 className="text-md font-semibold">{item.name}</h1>
                                        <p className={"line-clamp-4 truncate text-justify text-muted-foreground"}>{item.value}</p>
                                    </div>
                                ))
                            }
                        </CardContent>
                        {/*<CardFooter>*/}
                        {/*    <p>Card Footer</p>*/}
                        {/*</CardFooter>*/}
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Item Details</CardTitle>
                            <CardDescription>Details information of item '{data?.content?.name}'</CardDescription>
                            {/*<CardAction>Card Action</CardAction>*/}
                        </CardHeader>
                        <CardContent className={"grid md:grid-cols-2 lg:grid-cols-3 gap-4"}>
                            {data?.content?.item_detail && Object.entries(data?.content?.item_detail).map(([k, v]) => {
                                const skippedKey = ["id", "item_id", "created_at", "updated_at"]
                                if (skippedKey.includes(k, 0) || v === null) {
                                    return
                                }
                                return (
                                    <div>
                                        <h1 className="text-md font-semibold capitalize">{k.split("_").join(" ")}</h1>
                                        <p className={"line-clamp-4 truncate text-justify text-muted-foreground"}>{
                                            (k === "stnk_date" ? DateFormatter(v, false) : v)
                                        }</p>
                                    </div>
                                )
                            })}
                        </CardContent>
                        {/*<CardFooter>*/}
                        {/*    <p>Card Footer</p>*/}
                        {/*</CardFooter>*/}
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Item Documents</CardTitle>
                            <CardDescription>Documents information of item '{data?.content?.name}'</CardDescription>
                            {/*<CardAction>Card Action</CardAction>*/}
                        </CardHeader>
                        <CardContent className={"grid md:grid-cols-2 lg:grid-cols-3 gap-4"}>
                            {data?.content?.item_detail && Object.entries(data?.content?.item_document!).map(([k, v]) => {
                                const skippedKey = ["id", "item_id", "created_at", "updated_at"]
                                if (skippedKey.includes(k, 0) || v === null) {
                                    return
                                }
                                return (
                                    <div>
                                        <h1 className="text-md font-semibold capitalize">{k.split("_").join(" ")}</h1>
                                        <p className={"line-clamp-4 truncate text-justify text-muted-foreground"}>{v ? "Yes" : "No"}</p>
                                    </div>
                                )
                            })}
                        </CardContent>
                        {/*<CardFooter>*/}
                        {/*    <p>Card Footer</p>*/}
                        {/*</CardFooter>*/}
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Item Grades</CardTitle>
                            <CardDescription>Grades information of item '{data?.content?.name}'</CardDescription>
                            {/*<CardAction>Card Action</CardAction>*/}
                        </CardHeader>
                        <CardContent className={"grid grid-cols-2 lg:grid-cols-4 gap-4"}>
                            {data?.content?.item_detail && Object.entries(data?.content?.item_grade!).map(([k, v]) => {
                                const skippedKey = ["id", "item_id", "created_at", "updated_at"]
                                if (skippedKey.includes(k, 0) || v === null) {
                                    return
                                }
                                return (
                                    <div>
                                        <h1 className="text-md font-semibold capitalize">{k}</h1>
                                        <p className={"line-clamp-4 truncate text-justify text-muted-foreground"}>{(
                                            typeof v === "string" && v.toUpperCase()
                                        )}</p>
                                    </div>
                                )
                            })}
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
