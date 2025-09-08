import axios from "axios"
import type {ApiResponse} from "@/types/apiResponse"
import {toast} from "sonner";

export const EntityDelete = ({
                                       entityName,
                                       id
                                   }: {
    entityName: string
    id: string
}) => {
    return axios
        .delete<ApiResponse<any>>(`http://127.0.0.1:8080/api/${entityName}/${id}`)
        .then(res => toast(res.data.message))
}
