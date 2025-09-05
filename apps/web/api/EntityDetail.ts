import axios from "axios"
import type {ApiResponse} from "@/types/apiResponse"

export const GetEntityDetail = <T>({
                                       entityName,
                                       id
                                   }: {
    entityName: string
    id: string
}) => {
    return axios
        .get<ApiResponse<T>>(`http://127.0.0.1:8080/api/${entityName}/${id}`)
        .then(res => res.data)
}
