import type {Mandatory} from "@/types/mandatory";
import type {Auction} from "@/types/auction";

export type Pic = Mandatory & {
    name: string
    phone_number: string
    auctions: Auction[]
}