import {useMutation, useQueryClient} from "@tanstack/react-query"
import {toast} from "sonner"
import {EntityCreate} from "@/api/EntityCreate"
import type {ApiResponse} from "@/types/apiResponse"

export const useEntityCreate = <T = any>(entityName: string) => {
    const queryClient = useQueryClient()

    return useMutation<ApiResponse<T>, Error, { data: any; useFormData?: boolean }>({
        mutationFn: ({data, useFormData = false}) =>
            EntityCreate({entityName, data, useFormData})
                .then((res) => {
                    toast.success(res.message)
                    return res
                })
                .catch((err) => {
                    toast.error(err.message)
                    throw err
                }),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: [entityName]})
        },
    })
}
