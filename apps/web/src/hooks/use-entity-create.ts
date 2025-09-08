import {useMutation, useQueryClient} from "@tanstack/react-query"
import {toast} from "sonner"
import {EntityCreate} from "@/api/EntityCreate";

export const useEntityCreate = (entityName: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({data}: { data: any }) =>
            EntityCreate({entityName, data}).then((data) => toast.success(data.message)).catch((err) => toast.error(err.message)),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: [entityName]})
        },
    })
}
