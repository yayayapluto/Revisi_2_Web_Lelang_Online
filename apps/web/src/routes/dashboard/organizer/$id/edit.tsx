import {createFileRoute} from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/organizer/$id/edit')({
    component: RouteComponent,
})

function RouteComponent() {
    return <div>Hello "/dashboard/object-type/$id/edit"!</div>
}
