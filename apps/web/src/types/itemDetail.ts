import type { Mandatory } from "@/types/mandatory"

export type ItemDetail = Mandatory & {
    item_id: number
    plate_number: string | null
    brand: string
    series: string | null
    cc: number | null
    type: string | null
    transmission: string | null
    model: string | null
    year: number
    frame_number: string | null
    machine_number: string | null
    kilometer: number | null
    fuel: string | null
    color: string
    drive_type: string | null
    stnk_date: string | null
}
