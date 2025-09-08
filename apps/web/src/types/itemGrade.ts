import type {Mandatory} from "@/types/mandatory"

export type ItemGrade = Mandatory & {
    item_id: number
    interior: string
    exterior: string
    frame: string
    machine: string
}
