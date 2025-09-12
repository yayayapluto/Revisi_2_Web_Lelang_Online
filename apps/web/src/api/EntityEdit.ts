// api/objectTypes.ts
import axios from "axios"
import type {ApiResponse} from "@/types/apiResponse"


export const EntityEdit = ({
                                 entityName,
                                 id,
                                 data,
                             }: {
    entityName: string,
    id: number | string,
    data: Record<string, any>
    useFormData?: boolean
}) => {
    let payload: any = data
    let headers: Record<string, string> = {}

    return axios
        .put<ApiResponse<any>>(
            `http://127.0.0.1:8080/api/${entityName}/${id}`,
            payload,
            {headers}
        )
        .then(res => res.data)
}

/**
 * {
 *     "success": true,
 *     "message": "successfully created new item",
 *     "content": {
 *         "id": 52,
 *         "object_type_id": 4,
 *         "name": "dsfekuda",
 *         "price": 98898888,
 *         "deposit_price": 109909,
 *         "description": "deafs",
 *         "file_id": 20,
 *         "object_type": {
 *             "id": 4,
 *             "name": "Type-3-you",
 *             "created_at": "2025-09-08T14:38:43.352044+07:00",
 *             "updated_at": "2025-09-08T14:38:43.352044+07:00"
 *         },
 *         "file": {
 *             "id": 20,
 *             "path": "./public/uploads/2025-09-11/1757576484_c9ca2c2f-e755-469b-b81e-b8687ccf980f.jpeg",
 *             "created_at": "2025-09-11T14:41:24.142595+07:00",
 *             "updated_at": "2025-09-11T14:41:24.142595+07:00"
 *         },
 *         "item_thumbnails": [],
 *         "created_at": "2025-09-11T14:41:24.145247+07:00",
 *         "updated_at": "2025-09-11T14:41:24.145247+07:00"
 *     },
 *     "error": null
 * }
 */