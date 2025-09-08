import type {Mandatory} from "@/types/mandatory"

export type ItemDocument = Mandatory & {
    item_id: number
    bpkb: boolean | null
    stnk: boolean | null
    facture: boolean | null
    receipt: boolean | null
    ownership_release: boolean | null
    warranty: boolean | null
    box: boolean | null
}
