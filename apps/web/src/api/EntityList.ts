// api/objectTypes.ts
import axios from "axios"
import type {ApiResponse} from "@/types/apiResponse"
import type {Pagination} from "@/types/pagination"


export const GetEntityList = <T>({
                                     entity,
                                     search,
                                     page,
                                     size,
                                     sortBy,
                                     sortDir,
                                 }: {
    entity: string
    search?: string
    page?: number
    size?: number
    sortBy?: string
    sortDir?: string
}) => {
    return axios
        .get<ApiResponse<Pagination<T>>>(`http://127.0.0.1:8080/api/${entity}`, {
            params: {
                search,
                page,
                size,
                sortBy,
                sortDir
            }
        })
        .then(res => res.data)
}
