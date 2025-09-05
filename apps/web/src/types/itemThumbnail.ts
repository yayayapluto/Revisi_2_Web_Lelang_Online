import type { Mandatory } from "@/types/mandatory"
import type { File } from "@/types/file"

export type ItemThumbnail = Mandatory & {
    name: string
    item_id: number
    file_id: number
    file: File
}
