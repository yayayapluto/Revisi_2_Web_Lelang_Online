import {createFileRoute} from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/auction/create')({
    component: RouteComponent,
})

function RouteComponent() {
    return <div>Hello "/dashboard/object-type/create"!</div>
}
