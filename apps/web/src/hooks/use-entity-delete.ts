// hooks/useEntityDelete.ts
import {useMutation, useQueryClient} from "@tanstack/react-query"
import {EntityDelete} from "@/api/EntityDelete"
import {toast} from "sonner"

type EntityDeletePayload = {
    id: string | number
}

export const useEntityDelete = (entityName: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({id}: EntityDeletePayload) =>
            EntityDelete({entityName, id}).then((data) => toast.success(data.message)),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: [entityName]})
        },
    })
}
