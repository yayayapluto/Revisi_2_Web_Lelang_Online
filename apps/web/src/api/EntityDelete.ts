// api/objectTypes.ts
import axios from "axios"
import type {ApiResponse} from "@/types/apiResponse"


export const EntityDelete = ({
                                       entityName,
                                       id
                                   }: {
    entityName: string
    id: string | number
}) => {
    return axios
        .delete<ApiResponse<any>>(`http://127.0.0.1:8080/api/${entityName}/${id}`)
        .then(res => res.data)
}
