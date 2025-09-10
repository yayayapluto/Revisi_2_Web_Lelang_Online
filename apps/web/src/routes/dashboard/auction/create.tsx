import {createFileRoute} from '@tanstack/react-router'
import React, {useState} from "react";
import {useEntityCreate} from "@/hooks/use-entity-create";
import {useForm} from "@tanstack/react-form";
import {useQuery} from "@tanstack/react-query";
import type {ObjectType} from "@/types/objectType";
import {GetEntityList} from "@/api/EntityList";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Dropzone, DropzoneContent, DropzoneEmptyState} from "@/components/ui/shadcn-io/dropzone";
import {Select, SelectContent, SelectItem, SelectTrigger} from "@/components/ui/select";
import {SelectValue} from "@radix-ui/react-select";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {FieldInfo} from "@/components/field-info";
import {Textarea} from "@/components/ui/textarea";
import {Checkbox} from "@/components/ui/checkbox";
import {Calendar} from "@/components/ui/calendar";

export const Route = createFileRoute('/dashboard/auction/create')({
    component: RouteComponent,
})

function RouteComponent() {
    let {mutate} = useEntityCreate("auctions");
    const itemForm = useForm({
        defaultValues: {
            file_id: 0,
            object_type_id: 0,
            name: "",
            price: 0,
            deposit_price: 0,
            description: "",
        },
        onSubmit: async ({value}) => {
            mutate({data: value})
        },
    })

    const itemDetailInputs = {
        brand: "",
        year: 0,
        color: "",
        plate_number: "",
        series: "",
        cc: 0,
        type: "",
        transmission: "",
        model: "",
        frame_number: 0,
        machine_number: 0,
        kilometer: 0,
        fuel: "",
        drive_type: "",
        stnk_date: "",
    }
    const itemDetailForm = useForm({
        defaultValues: itemDetailInputs,
        onSubmit: async ({value}) => {
            mutate({data: value})
        },
    })

    const itemDocumentInputs = {
        bpkb: false,
        stnk: false,
        factur: false,
        receipt: false,
        ownership_release: false,
        warranty: false,
        box: false,
    }
    const itemDocumentForm = useForm({
        defaultValues: itemDocumentInputs,
        onSubmit: async ({value}) => {
            mutate({data: value})
        },
    })

    const itemGradeInputs = {
        interior: "",
        exterior: "",
        frame: "",
        machine: "",
    }
    const itemGradeForm = useForm({
        defaultValues: itemGradeInputs,
        onSubmit: async ({value}) => {
            mutate({data: value})
        },
    })

    const itemThumbnailInputs = {
        name: "",
    }
    const itemThumbnailForm = useForm({
        defaultValues: itemThumbnailInputs,
        onSubmit: async ({value}) => {
            mutate({data: value})
        },
    })

    const auctionInputs = {
        organizer_id: 0,
        pic_id: 0,
        start_date: "",
        end_date: "",
    }
    const auctionForm = useForm({
        defaultValues: auctionInputs,
        onSubmit: async ({value}) => {
            mutate({data: value})
        },
    })

    const [files, setFiles] = useState<File[] | undefined>();
    const [filePreview, setFilePreview] = useState<string | undefined>();
    const handleDrop = (files: File[]) => {
        console.log(files);
        setFiles(files);
        if (files.length > 0) {
            const reader = new FileReader();
            reader.onload = (e) => {
                if (typeof e.target?.result === 'string') {
                    setFilePreview(e.target?.result);
                }
            };
            reader.readAsDataURL(files[0]);
        }
    };

    const {data: objectTypeData, isLoading: objectTypeIsLoading} = useQuery(({
        queryKey: ["objectTypes"],
        queryFn: () => GetEntityList<ObjectType>({
            entity: "objectTypes",
        }),
    }))
    const {data: organizerData, isLoading: organizerIsLoading} = useQuery(({
        queryKey: ["organizers"],
        queryFn: () => GetEntityList<ObjectType>({
            entity: "organizers",
        }),
    }))
    const {data: picData, isLoading: picIsLoading} = useQuery(({
        queryKey: ["pics"],
        queryFn: () => GetEntityList<ObjectType>({
            entity: "pics",
        }),
    }))

    const [startDate, setStartDate] = React.useState<Date | undefined>(
        new Date(Date.now())
    )

    const [endDate, setEndDate] = React.useState<Date | undefined>(
        new Date(Date.now())
    )

    return (
        <div className={"grid gap-4"}>
            <Card>
                <CardHeader>
                    <CardTitle>
                        Item Section
                    </CardTitle>
                    <CardDescription>
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Debitis, labore.
                    </CardDescription>
                    <CardContent className={"px-0 py-1"}>
                        <form
                            id="auction-form"
                            onSubmit={e => {
                                e.preventDefault()
                                e.stopPropagation()
                                itemForm.handleSubmit()
                            }}
                            className="grid lg:grid-cols-2 gap-4"
                        >
                            <auctionForm.Field
                                name={"organizer_id"}
                                children={(field) => (
                                    <Select
                                        onValueChange={e => field.handleChange(parseInt(e))}
                                    >
                                        <SelectTrigger className={"w-full"}>
                                            <SelectValue placeholder={"Select Organizer"}/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {!organizerIsLoading && organizerData && organizerData?.content?.data?.map(organizer => (
                                                <SelectItem value={`${organizer.id}`}
                                                            className={"capitalize"}>{organizer.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />

                            <auctionForm.Field
                                name={"pic_id"}
                                children={(field) => (
                                    <Select
                                        onValueChange={e => field.handleChange(parseInt(e))}
                                    >
                                        <SelectTrigger className={"w-full"}>
                                            <SelectValue placeholder={"Select Pic"}/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {!picIsLoading && picData && picData?.content?.data?.map(pic => (
                                                <SelectItem value={`${pic.id}`}
                                                            className={"capitalize"}>{pic.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />

                            <auctionForm.Field
                                name={"start_date"}
                                children={(field) => (
                                    <div className={"grid gap-3"}>
                                        <Label htmlFor={field.name}
                                               className={"capitalize"}>{field.name.split("_").join(" ")}</Label>

                                        <Calendar
                                            mode="single"
                                            defaultMonth={startDate}
                                            selected={startDate}
                                            onSelect={setStartDate}
                                            disabled={{
                                                before: new Date(Date.now()),
                                            }}
                                            className="rounded-lg border shadow-sm"
                                        />
                                        <FieldInfo field={field}/>
                                    </div>
                                )}
                            />

                            <auctionForm.Field
                                name={"end_date"}
                                children={(field) => (
                                    <div className={"grid gap-3"}>
                                        <Label htmlFor={field.name}
                                               className={"capitalize"}>{field.name.split("_").join(" ")}</Label>

                                        <Calendar
                                            mode="single"
                                            defaultMonth={endDate}
                                            selected={endDate}
                                            onSelect={setEndDate}
                                            disabled={{
                                                before: new Date(startDate ?? Date.now()),
                                            }}
                                            className="rounded-lg border shadow-sm"
                                        />
                                        <FieldInfo field={field}/>
                                    </div>
                                )}
                            />
                        </form>
                    </CardContent>
                </CardHeader>
            </Card>


            {/* Item Related */}
            <div className={"grid lg:grid-cols-2 gap-4"}>
                <Card>
                    <CardHeader>
                        <CardTitle>
                            Item Section
                        </CardTitle>
                        <CardDescription>
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Debitis, labore.
                        </CardDescription>
                        <CardContent className={"px-0 py-1"}>
                            <form
                                id="item-form"
                                onSubmit={e => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    itemForm.handleSubmit()
                                }}
                                className="grid lg:grid-cols-2 gap-4"
                            >
                                <div className={"grid gap-4"}>
                                    <Dropzone
                                        accept={{'image/*': ['.png', '.jpg', '.jpeg']}}
                                        onDrop={handleDrop}
                                        onError={console.error}
                                        src={files}
                                        className={"aspect-square"}
                                    >
                                        <DropzoneEmptyState/>
                                        <DropzoneContent>
                                            {filePreview && (
                                                <div className="aspect-square size-full">
                                                    <img
                                                        alt="Preview"
                                                        className="absolute top-0 left-0 size-full aspect-square object-cover"
                                                        src={filePreview}
                                                    />
                                                </div>
                                            )}
                                        </DropzoneContent>
                                    </Dropzone>
                                    <itemForm.Field
                                        name={"object_type_id"}
                                        children={(field) => (
                                            <Select
                                                onValueChange={e => field.handleChange(parseInt(e))}
                                            >
                                                <SelectTrigger className={"w-full"}>
                                                    <SelectValue placeholder={"Select Object Types"}/>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {!objectTypeIsLoading && objectTypeData && objectTypeData?.content?.data?.map(objectType => (
                                                        <SelectItem value={`${objectType.id}`}
                                                                    className={"capitalize"}>{objectType.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                </div>
                                <div className={"grid flex-1 auto-rows-min gap-4"}>
                                    <itemForm.Field
                                        name={"name"}
                                        children={(field) => (
                                            <div className={"grid gap-3"}>
                                                <Label htmlFor={field.name}
                                                       className={"capitalize"}>{field.name.split("_").join(" ")}</Label>
                                                <Input
                                                    id={field.name}
                                                    name={field.name}
                                                    value={field.state.value}
                                                    onBlur={field.handleBlur}
                                                    onChange={(e) => field.handleChange(e.target.value)}
                                                />
                                                <FieldInfo field={field}/>
                                            </div>
                                        )}
                                    />
                                    <itemForm.Field
                                        name={"price"}
                                        children={(field) => (
                                            <div className={"grid gap-3"}>
                                                <Label htmlFor={field.name}
                                                       className={"capitalize"}>{field.name.split("_").join(" ")}</Label>
                                                <Input
                                                    id={field.name}
                                                    name={field.name}
                                                    value={field.state.value}
                                                    onBlur={field.handleBlur}
                                                    onChange={(e) => field.handleChange(parseInt(e.target.value))}
                                                />
                                                <FieldInfo field={field}/>
                                            </div>
                                        )}
                                    />
                                    <itemForm.Field
                                        name={"deposit_price"}
                                        children={(field) => (
                                            <div className={"grid gap-3"}>
                                                <Label htmlFor={field.name}
                                                       className={"capitalize"}>{field.name.split("_").join(" ")}</Label>
                                                <Input
                                                    id={field.name}
                                                    name={field.name}
                                                    value={field.state.value}
                                                    onBlur={field.handleBlur}
                                                    onChange={(e) => field.handleChange(parseInt(e.target.value))}
                                                />
                                                <FieldInfo field={field}/>
                                            </div>
                                        )}
                                    />
                                    <itemForm.Field
                                        name={"description"}
                                        children={(field) => (
                                            <div className={"grid gap-3"}>
                                                <Label htmlFor={field.name}
                                                       className={"capitalize"}>{field.name.split("_").join(" ")}</Label>
                                                <Textarea
                                                    id={field.name}
                                                    name={field.name}
                                                    value={field.state.value}
                                                    onBlur={field.handleBlur}
                                                    onChange={(e) => field.handleChange(e.target.value)}
                                                    className={"min-h-40"}
                                                />
                                                <FieldInfo field={field}/>
                                            </div>
                                        )}
                                    />
                                </div>
                            </form>
                        </CardContent>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>
                            Item Detail Section
                        </CardTitle>
                        <CardDescription>
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Debitis, labore.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form
                            id="itemDetail-form"
                            onSubmit={e => {
                                e.preventDefault()
                                e.stopPropagation()
                                itemForm.handleSubmit()
                            }}
                            className="grid lg:grid-cols-3 gap-4"
                        >
                            {Object.entries(itemDetailInputs).map(([key, value]) => (
                                <itemDetailForm.Field
                                    name={key as "brand" | "year" | "color"}
                                    children={(field) => (
                                        <div className={"grid gap-3"}>
                                            <Label htmlFor={field.name}
                                                   className={"capitalize"}>{field.name.split("_").join(" ")}</Label>
                                            <Input
                                                id={field.name}
                                                name={field.name}
                                                value={field.state.value}
                                                onBlur={field.handleBlur}
                                                onChange={(e) => field.handleChange(typeof value === "string" ? e.target.value : parseInt(e.target.value))}
                                            />
                                            <FieldInfo field={field}/>
                                        </div>
                                    )}
                                />
                            ))}
                        </form>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>
                            Item Detail Section
                        </CardTitle>
                        <CardDescription>
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Debitis, labore.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form
                            id="itemDetail-form"
                            onSubmit={e => {
                                e.preventDefault()
                                e.stopPropagation()
                                itemForm.handleSubmit()
                            }}
                            className="grid grid-cols-4 gap-4"
                        >
                            {Object.entries(itemGradeInputs).map(([key, value]) => (
                                <itemGradeForm.Field
                                    name={key as "interior" | "exterior" | "frame" | "machine"}
                                    children={(field) => (
                                        <div className={"grid gap-3"}>
                                            <Label htmlFor={field.name}
                                                   className={"capitalize"}>{field.name.split("_").join(" ")}</Label>
                                            <Input
                                                id={field.name}
                                                name={field.name}
                                                value={field.state.value}
                                                onBlur={field.handleBlur}
                                                onChange={(e) => field.handleChange(e.target.value)}
                                            />
                                            <FieldInfo field={field}/>
                                        </div>
                                    )}
                                />
                            ))}
                        </form>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>
                            Item Detail Section
                        </CardTitle>
                        <CardDescription>
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Debitis, labore.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form
                            id="itemDocument-form"
                            onSubmit={e => {
                                e.preventDefault()
                                e.stopPropagation()
                                itemForm.handleSubmit()
                            }}
                            className="grid gap-4"
                        >
                            {Object.entries(itemDocumentInputs).map(([key, value]) => (
                                <itemDocumentForm.Field
                                    name={key as "bpkb" | "stnk" | "factur" | "receipt" | "ownership_release" | "warranty" | "box"}
                                    children={(field) => (
                                        <div className={"grid grid-cols-2"}>
                                            <Label htmlFor={field.name}
                                                   className={"capitalize"}>{field.name.split("_").join(" ")}</Label>
                                            <Checkbox
                                                id={field.name}
                                                name={field.name}
                                                checked={field.state.value}
                                                onBlur={field.handleBlur}
                                                onCheckedChange={(e) => field.handleChange(e as boolean)}
                                            />
                                            <FieldInfo field={field}/>
                                        </div>
                                    )}
                                />
                            ))}
                        </form>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>
                            Item Section
                        </CardTitle>
                        <CardDescription>
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Debitis, labore.
                        </CardDescription>
                        <CardContent className={"px-0 py-1"}>
                            <form
                                id="itemThumbnail-form"
                                onSubmit={e => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    itemForm.handleSubmit()
                                }}
                                className="grid lg:grid-cols-2 items-start gap-4"
                            >
                                <Dropzone
                                    accept={{'image/*': ['.png', '.jpg', '.jpeg']}}
                                    onDrop={handleDrop}
                                    onError={console.error}
                                    src={files}
                                    className={"aspect-square"}
                                >
                                    <DropzoneEmptyState/>
                                    <DropzoneContent>
                                        {filePreview && (
                                            <div className="aspect-square size-full">
                                                <img
                                                    alt="Preview"
                                                    className="absolute top-0 left-0 size-full aspect-square object-cover"
                                                    src={filePreview}
                                                />
                                            </div>
                                        )}
                                    </DropzoneContent>
                                </Dropzone>
                                <itemThumbnailForm.Field
                                    name={"name"}
                                    children={(field) => (
                                        <div className={"grid gap-3"}>
                                            <Label htmlFor={field.name}
                                                   className={"capitalize"}>{field.name.split("_").join(" ")}</Label>
                                            <Input
                                                id={field.name}
                                                name={field.name}
                                                value={field.state.value}
                                                onBlur={field.handleBlur}
                                                onChange={(e) => field.handleChange(e.target.value)}
                                            />
                                            <FieldInfo field={field}/>
                                        </div>
                                    )}
                                />
                            </form>
                        </CardContent>
                    </CardHeader>
                </Card>

            </div>
        </div>
    )
}
