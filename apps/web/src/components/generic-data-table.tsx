import {useEffect, useState} from "react"
import {useQuery} from "@tanstack/react-query"
import {
    type ColumnDef,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    type SortingState,
    useReactTable
} from "@tanstack/react-table"
import {GetEntityList} from "@/api/EntityList"
import {DataTable} from "@/components/data-table"
import {AnimatePresence, motion} from "motion/react"

interface GenericDataTableProps<T> {
    entity: string
    columns: ColumnDef<T>[]
    debounceDelay?: number
    initialPageSize?: number
    defaultSortBy?: string
    currentEntity?: string
}

export function GenericDataTable<T>({
                                        entity,
                                        columns,
                                        debounceDelay = 200,
                                        initialPageSize = 10,
                                        defaultSortBy = "id",
                                        currentEntity
                                    }: GenericDataTableProps<T>) {
    const [pageIndex, setPageIndex] = useState(0)
    const [pageSize, setPageSize] = useState(initialPageSize)
    const [sorting, setSorting] = useState<SortingState>([])
    const [search, setSearch] = useState("")
    const [debouncedSearch, setDebouncedSearch] = useState("")

    const sortBy = sorting[0]?.id ?? defaultSortBy
    const sortDir = sorting[0]?.desc ? "desc" : "asc"

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search)
            setPageIndex(0)
        }, debounceDelay)

        return () => clearTimeout(timer)
    }, [search, debounceDelay])

    const {data, isLoading, isFetching} = useQuery({
        queryKey: [entity, debouncedSearch, pageIndex, pageSize, sortBy, sortDir],
        queryFn: () =>
            GetEntityList<T>({
                entity,
                page: pageIndex + 1,
                size: pageSize,
                sortBy,
                sortDir,
                search: debouncedSearch,
            }),
    })

    const table = useReactTable({
        data: data?.content?.data ?? [],
        columns,
        pageCount: data?.content?.total_pages ?? 1,
        state: {
            pagination: {pageIndex, pageSize},
            sorting,
        },
        onPaginationChange: (updater) => {
            const newState =
                typeof updater === "function"
                    ? updater({pageIndex, pageSize})
                    : updater
            setPageIndex(newState.pageIndex)
            setPageSize(newState.pageSize)
        },
        onSortingChange: setSorting,
        manualPagination: true,
        manualSorting: true,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
    })
    return (
        <AnimatePresence mode={"wait"}>
            {data && !isLoading && (
                <motion.div
                    key="content"
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    exit={{opacity: 0}}
                    transition={{duration: 0.5, ease: "easeOut"}}
                >
                    <DataTable
                        columns={columns}
                        data={data?.content?.data ?? []}
                        table={table}
                        isLoading={isFetching}
                        onSearchChange={setSearch}
                        currentEntity={currentEntity}
                    />
                </motion.div>
            )}
        </AnimatePresence>
    )
}