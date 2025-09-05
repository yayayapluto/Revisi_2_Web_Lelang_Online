import type {Mandatory} from "@/types/mandatory";
import type {Item} from "@/types/item";

export type ObjectType = Mandatory & {
    name: string
    items: Item[] | null
}