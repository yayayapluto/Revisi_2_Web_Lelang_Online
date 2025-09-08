// api/objectTypes.ts
import axios from "axios"
import type {ApiResponse} from "@/types/apiResponse"


export const EntityCreate = ({
                                       entityName,
                                        data
                                   }: {
    entityName: string
    data: any
}) => {
    return axios
        .post<ApiResponse<any>>(`http://127.0.0.1:8080/api/${entityName}`, data)
        .then(res => res.data)
}
