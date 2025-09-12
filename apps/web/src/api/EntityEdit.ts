// api/objectTypes.ts
import axios from "axios"
import type {ApiResponse} from "@/types/apiResponse"


export const EntityEdit = ({
                               entityName,
                               id,
                               nested,
                               data,
                           }: {
    entityName: string,
    id: number | string,
    nested?: string,
    data: Record<string, any>
}) => {
    let payload: any = data
    let headers: Record<string, string> = {}

    return axios
        .put<ApiResponse<any>>(
            `http://127.0.0.1:8080/api/${entityName}/${id}${nested ? `/${nested}` : ""}`
            ,
            payload,
            {headers}
        )
        .then(res => res.data)
}