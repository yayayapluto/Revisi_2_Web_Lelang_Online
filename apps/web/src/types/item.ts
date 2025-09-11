import type {Mandatory} from "@/types/mandatory";
import type {ObjectType} from "@/types/objectType";
import type {File} from "@/types/file";
import type {ItemDetail} from "@/types/itemDetail";
import type {ItemDocument} from "@/types/itemDocument";
import type {ItemGrade} from "@/types/itemGrade";
import type {ItemThumbnail} from "@/types/itemThumbnail";
import type {Auction} from "@/types/auction";

export type Item = Mandatory & {
    object_type_id: number
    name: string
    price: number
    deposit_price: number
    description: string
    file_id: number
    object_type: ObjectType
    file: File
    item_detail?: ItemDetail
    item_document?: ItemDocument
    item_grade?: ItemGrade
    item_thumbnails?: ItemThumbnail[]
    auction?: Auction
}