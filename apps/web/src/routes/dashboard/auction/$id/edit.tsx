import {createFileRoute, useNavigate} from '@tanstack/react-router';
import React, {useEffect, useState} from "react";
import {useQuery} from "@tanstack/react-query";
import type {ObjectType} from "@/types/objectType";
import {GetEntityList} from "@/api/EntityList";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Select, SelectContent, SelectItem, SelectTrigger} from "@/components/ui/select";
import {SelectValue} from "@radix-ui/react-select";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Checkbox} from "@/components/ui/checkbox";
import {Calendar} from "@/components/ui/calendar";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {Progress} from "@/components/ui/progress";
import {AlertCircle, Check, ChevronLeft, ChevronRight} from "lucide-react";
import {z} from "zod";
import {CurrencyFormatter} from "@/utils/currency-formatter";
import {useEntityEdit} from "@/hooks/use-entity-edit";
import type {Item} from "@/types/item";
import type {Auction} from "@/types/auction";
import {EntityCreate} from "@/api/EntityCreate";
import {GetEntityDetail} from "@/api/EntityDetail";
import type {Organizer} from "@/types/organizer";
import type {Pic} from "@/types/pic";
import type {ItemDetail} from "@/types/itemDetail";
import type {ItemDocument} from "@/types/itemDocument";
import type {ItemGrade} from "@/types/itemGrade";

const auctionSchema = z.object({
    organizer_id: z.number().min(1, "Organizer is required"),
    pic_id: z.number().min(1, "PIC is required"),
    start_date: z.string().min(1, "Start date is required"),
    end_date: z.string().min(1, "End date is required"),
    file_id: z.number().min(1, "File is required"),
    object_type_id: z.number().min(1, "Object type is required"),
    name: z.string().min(3, "Name must be at least 3 characters"),
    price: z.number().min(1, "Price must be greater than 0"),
    deposit_price: z.number().min(1, "Deposit price must be greater than 0"),
    description: z.string(),
    brand: z.string().min(1, "Brand is required"),
    year: z.number().min(1900, "Invalid year"),
    color: z.string().min(1, "Color is required"),
    plate_number: z.string().optional(),
    series: z.string().optional(),
    cc: z.number().min(0),
    type: z.string().optional(),
    transmission: z.string().optional(),
    model: z.string().optional(),
    frame_number: z.number().min(0),
    machine_number: z.number().min(0),
    kilometer: z.number().min(0),
    fuel: z.string().optional(),
    drive_type: z.string().optional(),
    stnk_date: z.string().optional(),
    bpkb: z.boolean(),
    stnk: z.boolean(),
    factur: z.boolean(),
    receipt: z.boolean(),
    ownership_release: z.boolean(),
    warranty: z.boolean(),
    box: z.boolean(),
    interior: z.string().min(1, "Interior grade is required"),
    exterior: z.string().min(1, "Exterior grade is required"),
    frame: z.string().min(1, "Frame grade is required"),
    machine: z.string().min(1, "Machine grade is required"),
    thumbnail_name: z.string()
});
type AuctionFormData = z.infer<typeof auctionSchema>;

const steps = [
    {id: 1, title: "Auction Setup", description: "Basic auction information"},
    {id: 2, title: "Item Information", description: "Main item details"},
    {id: 3, title: "Item Details", description: "Detailed specifications"},
    {id: 4, title: "Item Grading", description: "Condition assessment"},
    {id: 5, title: "Documentation", description: "Available documents"},
    {id: 6, title: "Review", description: "Final review"}
];

export const Route = createFileRoute('/dashboard/auction/$id/edit')({
    component: EditRouteComponent,
});

function EditRouteComponent() {
    const navigate = useNavigate();
    const {id} = Route.useParams();
    const [currentStep, setCurrentStep] = useState(1);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [startDate, setStartDate] = useState<Date | undefined>();
    const [endDate, setEndDate] = useState<Date | undefined>();
    const [formData, setFormData] = useState<Partial<AuctionFormData>>({
        organizer_id: 0,
        pic_id: 0,
        start_date: "",
        end_date: "",
        file_id: 0,
        object_type_id: 0,
        name: "",
        price: 0,
        deposit_price: 0,
        description: "",
        brand: "",
        year: 2006,
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
        bpkb: false,
        stnk: false,
        factur: false,
        receipt: false,
        ownership_release: false,
        warranty: false,
        box: false,
        interior: "",
        exterior: "",
        frame: "",
        machine: "",
        thumbnail_name: ""
    });

    const {data: auctionData, isLoading: auctionIsLoading, error: auctionError} = useQuery({
        queryKey: ["auction", id],
        queryFn: () => GetEntityDetail<Auction>({entityName: "auctions", id: id}),
    });

    const {data: objectTypeData, isLoading: objectTypeIsLoading} = useQuery({
        queryKey: ["objectTypes"],
        queryFn: () => GetEntityList<ObjectType>({entity: "objectTypes", size: 100}),
    });

    const {data: organizerData, isLoading: organizerIsLoading} = useQuery({
        queryKey: ["organizers"],
        queryFn: () => GetEntityList<Organizer>({entity: "organizers", size: 100}),
    });

    const {data: picData, isLoading: picIsLoading} = useQuery({
        queryKey: ["pics"],
        queryFn: () => GetEntityList<Pic>({entity: "pics", size: 100},),
    });

    useEffect(() => {
        if (auctionData?.content) {
            const auction = auctionData.content;
            const item = auction.item;
            setFormData({
                organizer_id: auction.organizer_id,
                pic_id: auction.pic_id,
                start_date: auction.start_date,
                end_date: auction.end_date,
                file_id: item.file_id || 0,
                object_type_id: item.object_type_id,
                name: item.name,
                price: item.price,
                deposit_price: item.deposit_price,
                description: item.description || "",
                brand: item.item_detail?.brand || "",
                year: item.item_detail?.year || 0,
                color: item.item_detail?.color || "",
                plate_number: item.item_detail?.plate_number || "",
                series: item.item_detail?.series || "",
                cc: item.item_detail?.cc || 0,
                type: item.item_detail?.type || "",
                transmission: item.item_detail?.transmission || "",
                model: item.item_detail?.model || "",
                frame_number: parseInt(item.item_detail!.frame_number!) || 0,
                machine_number: parseInt(item.item_detail!.machine_number!) || 0,
                kilometer: item.item_detail?.kilometer || 0,
                fuel: item.item_detail?.fuel || "",
                drive_type: item.item_detail?.drive_type || "",
                stnk_date: item.item_detail?.stnk_date || "",
                bpkb: item.item_document?.bpkb || false,
                stnk: item.item_document?.stnk || false,
                factur: item.item_document?.facture || false,
                receipt: item.item_document?.receipt || false,
                ownership_release: item.item_document?.ownership_release || false,
                warranty: item.item_document?.warranty || false,
                box: item.item_document?.box || false,
                interior: item.item_grade?.interior || "",
                exterior: item.item_grade?.exterior || "",
                frame: item.item_grade?.frame || "",
                machine: item.item_grade?.machine || "",
                thumbnail_name: ""
            });
            setStartDate(new Date(auction.start_date));
            setEndDate(new Date(auction.end_date));
        }
    }, [auctionData]);

    const updateFormData = (field: keyof AuctionFormData, value: any) => {
        setFormData(prev => ({...prev, [field]: value}));
        if (errors[field]) {
            setErrors(prev => {
                const newErrors = {...prev};
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const validateStep = (step: number): boolean => {
        const stepValidations = {
            1: ["organizer_id", "pic_id", "start_date", "end_date"],
            2: ["object_type_id", "name", "price", "deposit_price", "description"],
            3: ["brand", "year", "color"],
            4: ["interior", "exterior", "frame", "machine"],
            5: [],
            6: []
        };
        const fieldsToValidate = stepValidations[step as keyof typeof stepValidations];
        const stepData = Object.fromEntries(
            fieldsToValidate.map(field => [field, formData[field as keyof AuctionFormData]])
        );
        try {
            const stepSchema = auctionSchema.pick(
                Object.fromEntries(fieldsToValidate.map(field => [field, true])) as any
            );
            stepSchema.parse(stepData);
            setErrors({});
            return true;
        } catch (error) {
            if (error instanceof z.ZodError) {
                const newErrors: Record<string, string> = {};
                error.issues.forEach(err => {
                    if (err.path[0]) {
                        newErrors[err.path[0] as string] = err.message;
                    }
                });
                setErrors(newErrors);
            }
            return false;
        }
    };

    const nextStep = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(prev + 1, steps.length));
        }
    };

    const prevStep = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    const {mutate: mutateEditAuction} = useEntityEdit<Auction>("auctions");
    const {mutate: mutateEditItem} = useEntityEdit<Item>("items");
    const {mutate: mutateEditItemDetail} = useEntityEdit<ItemDetail>("items", "detail");
    const {mutate: mutateEditItemDocument} = useEntityEdit<ItemDocument>("items", "document");
    const {mutate: mutateEditItemGrade} = useEntityEdit<ItemGrade>("items", "grade");

    const handleSubmit = () => {
        try {
            auctionSchema.parse(formData);
        } catch (error) {
            if (error instanceof z.ZodError) {
                const newErrors: Record<string, string> = {};
                error.issues.forEach(err => {
                    if (err.path[0]) {
                        newErrors[err.path[0] as string] = err.message;
                    }
                });
                setErrors(newErrors);
                alert("Please fix all errors before submitting");
                return;
            }
        }

        const auctionId = id;
        const itemId = auctionData?.content?.item.id;

        if (!itemId) {
            alert("Item ID not found. Cannot proceed.");
            return;
        }

        mutateEditAuction(
            {
                data: {
                    organizer_id: formData.organizer_id,
                    pic_id: formData.pic_id,
                    start_date: formData.start_date,
                    end_date: formData.end_date,
                },
                id: auctionId
            },
            {
                onSuccess: async () => {
                    let newItemData: Partial<Item> = {
                        object_type_id: formData.object_type_id,
                        name: formData.name,
                        price: formData.price,
                        deposit_price: formData.deposit_price,
                        description: formData.description,
                    };

                    mutateEditItem(
                        {
                            data: newItemData,
                            id: itemId
                        },
                        {
                            onSuccess: async () => {
                                mutateEditItemDetail({
                                    id: auctionData!.content!.item_id,
                                    data: {
                                        brand: formData.brand,
                                        year: formData.year,
                                        color: formData.color,
                                        plate_number: formData.plate_number,
                                        series: formData.series,
                                        cc: formData.cc,
                                        type: formData.type,
                                        transmission: formData.transmission,
                                        model: formData.model,
                                        frame_number: formData.frame_number?.toString(),
                                        machine_number: formData.machine_number?.toString(),
                                        kilometer: formData.kilometer,
                                        fuel: formData.fuel,
                                        drive_type: formData.drive_type,
                                        stnk_date: formData.stnk_date || null,
                                    }
                                });

                                mutateEditItemDocument({
                                    id: auctionData!.content!.item_id,
                                    data: {
                                        bpkb: formData.bpkb,
                                        stnk: formData.stnk,
                                        facture: formData.factur,
                                        receipt: formData.receipt,
                                        ownership_release: formData.ownership_release,
                                        warranty: formData.warranty,
                                        box: formData.box
                                    }
                                });

                                mutateEditItemGrade({
                                    id: auctionData!.content!.item_id,
                                    data: {
                                        interior: formData.interior,
                                        exterior: formData.exterior,
                                        frame: formData.frame,
                                        machine: formData.machine
                                    }
                                });

                                navigate({to: "/dashboard/auction/$id", params: {id: auctionId}});
                            },
                            onError: (error) => {
                                console.error("Error updating item:", error);
                            }
                        }
                    );
                },
                onError: (error) => {
                    console.error("Error updating auction:", error);
                }
            }
        );
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="grid gap-6">
                        <div className="grid lg:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Organizer</Label>
                                <Select
                                    value={formData.organizer_id?.toString() || ""} // Changed from ! to ? for safety, and ensure it's always a string
                                    onValueChange={e => updateFormData('organizer_id', parseInt(e))}
                                >
                                    <SelectTrigger className={`${errors.organizer_id ? "border-red-500" : ""} w-full`}>
                                        <SelectValue placeholder="Select Organizer"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {!organizerIsLoading && organizerData?.content?.data?.map(organizer => {
                                            console.log(`current: ${organizer.id}, formData: ${formData.organizer_id}, is same: ${organizer.id === formData.organizer_id}`);
                                            return (
                                                <SelectItem key={organizer.id}
                                                            value={organizer.id.toString()}> {/* <-- FIXED: Convert organizer.id to string */}
                                                    {organizer.name}
                                                </SelectItem>
                                            )
                                        })}
                                    </SelectContent>
                                </Select>
                                {errors.organizer_id && (
                                    <p className="text-sm text-red-500 flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3"/>
                                        {errors.organizer_id}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label>PIC</Label>
                                <Select
                                    value={formData.pic_id?.toString() || ""}
                                    onValueChange={e => updateFormData('pic_id', parseInt(e))}
                                >
                                    <SelectTrigger className={`${errors.pic_id ? "border-red-500" : ""} w-full`}>
                                        <SelectValue placeholder="Select PIC"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {!picIsLoading && picData?.content?.data?.map(pic => (
                                            <SelectItem key={pic.id} value={pic.id.toString()}>
                                                {pic.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.pic_id && (
                                    <p className="text-sm text-red-500 flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3"/>
                                        {errors.pic_id}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="grid lg:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label>Start Date</Label>
                                <Calendar
                                    mode="single"
                                    selected={startDate ?? undefined}
                                    onSelect={(date) => {
                                        setStartDate(date);
                                        updateFormData('start_date', date?.toISOString() || "");
                                    }}
                                    disabled={{before: new Date()}}
                                    defaultMonth={startDate ?? new Date()}
                                    className="rounded-lg border shadow-sm w-full"
                                    captionLayout={"dropdown"}
                                />
                                {errors.start_date && (
                                    <p className="text-sm text-red-500 flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3"/>
                                        {errors.start_date}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label>End Date</Label>
                                <Calendar
                                    mode="single"
                                    selected={endDate}
                                    onSelect={(date) => {
                                        setEndDate(date);
                                        updateFormData('end_date', date?.toISOString() || "");
                                    }}
                                    disabled={{before: startDate || new Date()}}
                                    className="rounded-lg border shadow-sm w-full"
                                    captionLayout={"dropdown"}
                                />
                                {errors.end_date && (
                                    <p className="text-sm text-red-500 flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3"/>
                                        {errors.end_date}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="grid lg:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Object Type</Label>
                                <Select
                                    value={formData.object_type_id?.toString() || ""}
                                    onValueChange={e => updateFormData('object_type_id', parseInt(e))}
                                >
                                    <SelectTrigger
                                        className={`${errors.object_type_id ? "border-red-500" : ""} w-full`}>
                                        <SelectValue placeholder="Select Object Type"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {!objectTypeIsLoading && objectTypeData?.content?.data?.map(objectType => (
                                            <SelectItem key={objectType.id} value={objectType.id.toString()}>
                                                {objectType.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.object_type_id && (
                                    <p className="text-sm text-red-500 flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3"/>
                                        {errors.object_type_id}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Item Name</Label>
                                <Input
                                    value={formData.name || ""}
                                    onChange={e => updateFormData('name', e.target.value)}
                                    className={errors.name ? "border-red-500" : ""}
                                    placeholder="Enter item name"
                                />
                                {errors.name && (
                                    <p className="text-sm text-red-500 flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3"/>
                                        {errors.name}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label>Price</Label>
                                <Input
                                    type="number"
                                    value={formData.price || ""}
                                    onChange={e => updateFormData('price', parseInt(e.target.value) || 0)}
                                    className={errors.price ? "border-red-500" : ""}
                                    placeholder="Enter price"
                                />
                                {errors.price && (
                                    <p className="text-sm text-red-500 flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3"/>
                                        {errors.price}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label>Deposit Price</Label>
                                <Input
                                    type="number"
                                    value={formData.deposit_price || ""}
                                    onChange={e => updateFormData('deposit_price', parseInt(e.target.value) || 0)}
                                    className={errors.deposit_price ? "border-red-500" : ""}
                                    placeholder="Enter deposit price"
                                />
                                {errors.deposit_price && (
                                    <p className="text-sm text-red-500 flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3"/>
                                        {errors.deposit_price}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label>Description</Label>
                                <Textarea
                                    value={formData.description || ""}
                                    onChange={e => updateFormData('description', e.target.value)}
                                    className={`min-h-32 ${errors.description ? "border-red-500" : ""}`}
                                    placeholder="Enter item description"
                                />
                                {errors.description && (
                                    <p className="text-sm text-red-500 flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3"/>
                                        {errors.description}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                );
            case 3:
                const detailFields = [
                    {key: 'brand', label: 'Brand', type: 'text', required: true},
                    {key: 'year', label: 'Year', type: 'number', required: true},
                    {key: 'color', label: 'Color', type: 'text', required: true},
                    {key: 'plate_number', label: 'Plate Number', type: 'text'},
                    {key: 'series', label: 'Series', type: 'text'},
                    {key: 'cc', label: 'CC', type: 'number'},
                    {key: 'type', label: 'Type', type: 'text'},
                    {key: 'transmission', label: 'Transmission', type: 'text'},
                    {key: 'model', label: 'Model', type: 'text'},
                    {key: 'frame_number', label: 'Frame Number', type: 'number'},
                    {key: 'machine_number', label: 'Machine Number', type: 'number'},
                    {key: 'kilometer', label: 'Kilometer', type: 'number'},
                    {key: 'fuel', label: 'Fuel', type: 'text'},
                    {key: 'drive_type', label: 'Drive Type', type: 'text'},
                    {key: 'stnk_date', label: 'STNK Date', type: 'text'}
                ];
                return (
                    <div className="grid lg:grid-cols-3 gap-4">
                        {detailFields.map(field => (
                            <div key={field.key} className="space-y-2">
                                <Label>{field.label} {field.required && <span className="text-red-500">*</span>}</Label>
                                <Input
                                    type={field.type}
                                    value={formData[field.key as keyof AuctionFormData]?.toString() || ""}
                                    onChange={e => {
                                        const value = field.type === 'number' ?
                                            (parseInt(e.target.value) || 0) :
                                            e.target.value;
                                        updateFormData(field.key as keyof AuctionFormData, value);
                                    }}
                                    className={errors[field.key] ? "border-red-500" : ""}
                                    placeholder={`Enter ${field.label.toLowerCase()}`}
                                />
                                {errors[field.key] && (
                                    <p className="text-sm text-red-500 flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3"/>
                                        {errors[field.key]}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                );
            case 4:
                const gradeFields = ['interior', 'exterior', 'frame', 'machine'];
                return (
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {gradeFields.map(field => (
                            <div key={field} className="space-y-2">
                                <Label className="capitalize">{field} Grade *</Label>
                                <Select
                                    value={formData[field as keyof AuctionFormData]?.toString().toUpperCase() || ""}
                                    onValueChange={value => updateFormData(field as keyof AuctionFormData, value)}
                                >
                                    <SelectTrigger className={errors[field] ? "border-red-500" : ""}>
                                        <SelectValue placeholder={`Select ${field} grade`}/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="A">A - Excellent</SelectItem>
                                        <SelectItem value="B">B - Good</SelectItem>
                                        <SelectItem value="C">C - Fair</SelectItem>
                                        <SelectItem value="D">D - Poor</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors[field] && (
                                    <p className="text-sm text-red-500 flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3"/>
                                        {errors[field]}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                );
            case 5:
                const documentFields = [
                    {key: 'bpkb', label: 'BPKB'},
                    {key: 'stnk', label: 'STNK'},
                    {key: 'factur', label: 'Factur'},
                    {key: 'receipt', label: 'Receipt'},
                    {key: 'ownership_release', label: 'Ownership Release'},
                    {key: 'warranty', label: 'Warranty'},
                    {key: 'box', label: 'Box'}
                ];
                return (
                    <div className="grid lg:grid-cols-2 gap-4">
                        {documentFields.map(field => (
                            <div key={field.key} className="flex items-center space-x-3 p-4 border rounded-lg">
                                <Checkbox
                                    id={field.key}
                                    checked={formData[field.key as keyof AuctionFormData] as boolean || false}
                                    onCheckedChange={checked => updateFormData(field.key as keyof AuctionFormData, checked)}
                                />
                                <Label htmlFor={field.key} className="cursor-pointer">{field.label}</Label>
                            </div>
                        ))}
                    </div>
                );
            case 6:
                return (
                    <div className="space-y-6">
                        <div className="text-center">
                            <h3 className="text-xl font-semibold mb-2">Review Your Auction</h3>
                            <p className="text-muted-foreground">Please review all information before submitting</p>
                        </div>
                        <div className="grid lg:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Auction Setup</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <div><strong>Organizer ID:</strong> {formData.organizer_id}</div>
                                    <div><strong>PIC ID:</strong> {formData.pic_id}</div>
                                    <div><strong>Start Date:</strong> {startDate?.toLocaleDateString()}</div>
                                    <div><strong>End Date:</strong> {endDate?.toLocaleDateString()}</div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Basic Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <div><strong>Object Type ID:</strong> {formData.object_type_id}</div>
                                    <div><strong>Name:</strong> {formData.name}</div>
                                    <div><strong>Price:</strong> {CurrencyFormatter(formData.price!)}</div>
                                    <div><strong>Deposit:</strong> {CurrencyFormatter(formData.deposit_price!)}</div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Vehicle Details</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <div><strong>Brand:</strong> {formData.brand}</div>
                                    <div><strong>Year:</strong> {formData.year}</div>
                                    <div><strong>Color:</strong> {formData.color}</div>
                                    <div><strong>Plate Number:</strong> {formData.plate_number || 'N/A'}</div>
                                    <div><strong>Series:</strong> {formData.series || 'N/A'}</div>
                                    <div><strong>CC:</strong> {formData.cc}</div>
                                    <div><strong>Type:</strong> {formData.type || 'N/A'}</div>
                                    <div><strong>Transmission:</strong> {formData.transmission || 'N/A'}</div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Technical Details</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <div><strong>Model:</strong> {formData.model || 'N/A'}</div>
                                    <div><strong>Frame Number:</strong> {formData.frame_number}</div>
                                    <div><strong>Machine Number:</strong> {formData.machine_number}</div>
                                    <div><strong>Kilometer:</strong> {formData.kilometer?.toLocaleString()} km</div>
                                    <div><strong>Fuel:</strong> {formData.fuel || 'N/A'}</div>
                                    <div><strong>Drive Type:</strong> {formData.drive_type || 'N/A'}</div>
                                    <div><strong>STNK Date:</strong> {formData.stnk_date || 'N/A'}</div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Condition Grades</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <div><strong>Interior:</strong> Grade {formData.interior}</div>
                                    <div><strong>Exterior:</strong> Grade {formData.exterior}</div>
                                    <div><strong>Frame:</strong> Grade {formData.frame}</div>
                                    <div><strong>Machine:</strong> Grade {formData.machine}</div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Available Documents</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <div><strong>BPKB:</strong> {formData.bpkb ? 'Yes' : 'No'}</div>
                                    <div><strong>STNK:</strong> {formData.stnk ? 'Yes' : 'No'}</div>
                                    <div><strong>Factur:</strong> {formData.factur ? 'Yes' : 'No'}</div>
                                    <div><strong>Receipt:</strong> {formData.receipt ? 'Yes' : 'No'}</div>
                                    <div><strong>Ownership Release:</strong> {formData.ownership_release ? 'Yes' : 'No'}
                                    </div>
                                    <div><strong>Warranty:</strong> {formData.warranty ? 'Yes' : 'No'}</div>
                                    <div><strong>Box:</strong> {formData.box ? 'Yes' : 'No'}</div>
                                </CardContent>
                            </Card>
                        </div>
                        <Card>
                            <CardHeader>
                                <CardTitle>Description</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="whitespace-pre-wrap">{formData.description}</p>
                            </CardContent>
                        </Card>
                    </div>
                );
            default:
                return null;
        }
    };

    if (auctionIsLoading) {
        return <div>Loading auction data...</div>;
    }

    if (auctionError) {
        return <div>Error loading auction: {auctionError.message}</div>;
    }

    if (!auctionData?.content) {
        return <div>No auction found.</div>;
    }

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-8">
            <div className="space-y-4">
                <div>
                    <h1 className="text-3xl font-bold">Edit Auction</h1>
                    <p className="text-muted-foreground">Modify the auction and item details below</p>
                </div>
                <Progress value={(currentStep / steps.length) * 100} className="w-full"/>
            </div>
            <div className="space-y-4">
                <div className="flex justify-between">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={prevStep}
                        disabled={currentStep === 1}
                        className="flex items-center space-x-2"
                    >
                        <ChevronLeft className="w-4 h-4"/>
                        <span>Previous</span>
                    </Button>
                    <div className="flex space-x-2">
                        {currentStep === steps.length ? (
                            <Button
                                type="button"
                                onClick={handleSubmit}
                                className="flex items-center space-x-2"
                            >
                                <Check className="w-4 h-4"/>
                                <span>Update Auction</span>
                            </Button>
                        ) : (
                            <Button
                                type="button"
                                onClick={nextStep}
                                className="flex items-center space-x-2"
                            >
                                <span>Next</span>
                                <ChevronRight className="w-4 h-4"/>
                            </Button>
                        )}
                    </div>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <span>{steps[currentStep - 1]?.title}</span>
                            <Badge variant="outline">
                                Step {currentStep} of {steps.length}
                            </Badge>
                        </CardTitle>
                        <CardDescription>
                            {steps[currentStep - 1]?.description}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {renderStepContent()}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}