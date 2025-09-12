import type {Mandatory} from "@/types/mandatory";
import type {Item} from "@/types/item";
import type {Pic} from "@/types/pic";
import type {Organizer} from "@/types/organizer";

export type Auction = Mandatory & {
    start_date: string
    end_date: string

    item_id: number
    organizer_id: number
    pic_id: number

    item: Item
    organizer: Organizer
    pic: Pic
}