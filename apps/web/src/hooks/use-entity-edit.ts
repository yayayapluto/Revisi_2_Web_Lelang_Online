import {useMutation, useQueryClient} from "@tanstack/react-query"
import {toast} from "sonner"
import {EntityCreate} from "@/api/EntityCreate"
import type {ApiResponse} from "@/types/apiResponse"
import {EntityEdit} from "@/api/EntityEdit";

export const useEntityEdit = <T = any>(entityName: string) => {
    const queryClient = useQueryClient()

    return useMutation<ApiResponse<T>, Error, { data: any; id: number | string }>({
        mutationFn: ({data, id}) =>
            EntityEdit({entityName, data, id})
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
