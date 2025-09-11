import * as React from "react"
import {
    BoxIcon,
    ChevronRight,
    Contact,
    FileTextIcon,
    Gavel,
    Medal,
    TrendingUp,
    UserPlus,
    Users,
    Wheat
} from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarRail,
} from "@/components/animate-ui/radix/sidebar"
import {Link, useLocation} from "@tanstack/react-router";
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "./animate-ui/radix/collapsible";

const DATA = [
    {
        label: "Dashboards",
        items: [
            {
                title: 'Object Type',
                url: '/dashboard/object-type',
                icon: BoxIcon,
                items: [
                    {title: 'All', url: "/dashboard/object-type"},
                ],
            },
            // {
            //     title: 'Item',
            //     url: '/dashboard/item',
            //     icon: FileTextIcon,
            //     items: [
            //         {title: 'All', url: "/dashboard/item"},
            //     ],
            // },
            {
                title: 'Organizer',
                url: '/dashboard/organizer',
                icon: Users,
                items: [
                    {title: 'All', url: "/dashboard/organizer"},
                ],
            },
            {
                title: 'PIC',
                url: '/dashboard/pic',
                icon: Contact,
                items: [
                    {title: 'All', url: "/dashboard/pic"},
                ],
            },
        ],
    },
    {
        label: "Auction Managements",
        items: [
            {
                title: 'Auction',
                url: '/dashboard/auction',
                icon: Gavel,
                items: [
                    {title: 'All', url: "/dashboard/auction"},
                    {title: 'Add New', url: "/dashboard/auction/create"},
                ],
            },
            {
                title: 'Bidders',
                url: '#',
                icon: UserPlus,
                items: [
                    {title: 'All', url: "/dashboard/auction-bidders"},
                ],
            },
            {
                title: 'Bids',
                url: '#',
                icon: TrendingUp,
                items: [
                    {title: 'All', url: "/dashboard/bids"},
                    {title: 'Live Monitor', url: "/dashboard/bids/live"},
                ],
            },
            {
                title: 'Winners',
                url: '#',
                icon: Medal,
                items: [
                    {title: 'All', url: "/dashboard/winners"},
                    {title: 'Unpaid', url: "/dashboard/winners?status=pending"},
                ],
            },
        ],
    },
];

export function AppSidebar({...props}: React.ComponentProps<typeof Sidebar>) {
    let location = useLocation()
    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                    <div
                        className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                        <Wheat/>
                    </div>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        Online Auction
                      </span>
                        <span className="truncate text-xs">
                        (Lorem ipsum dolor.)
                      </span>
                    </div>
                </SidebarMenuButton>
            </SidebarHeader>

            <SidebarContent>
                {DATA.map((data) => (
                    <SidebarGroup>
                        <SidebarGroupLabel>{data.label}</SidebarGroupLabel>
                        <SidebarMenu>
                            {data.items.map((item) => (
                                (item.items && item.items.length > 0) ? (
                                    <Collapsible
                                        key={item.title}
                                        asChild
                                        defaultOpen={location.pathname.includes(item.url)}
                                        className="group/collapsible"
                                    >
                                        <SidebarMenuItem>
                                            <CollapsibleTrigger asChild>
                                                <SidebarMenuButton tooltip={item.title}>
                                                    {item.icon && <item.icon/>}
                                                    <span>{item.title}</span>
                                                    <ChevronRight
                                                        className="ml-auto transition-transform duration-300 group-data-[state=open]/collapsible:rotate-90"/>
                                                </SidebarMenuButton>
                                            </CollapsibleTrigger>
                                            <CollapsibleContent>
                                                <SidebarMenuSub>
                                                    {item.items?.map((subItem) => (
                                                        <SidebarMenuSubItem key={subItem.title}>
                                                            <SidebarMenuSubButton asChild>
                                                                <Link to={subItem.url}
                                                                      className={"capitalize"}>{subItem.title}</Link>
                                                            </SidebarMenuSubButton>
                                                        </SidebarMenuSubItem>
                                                    ))}
                                                </SidebarMenuSub>
                                            </CollapsibleContent>
                                        </SidebarMenuItem>
                                    </Collapsible>
                                ) : (
                                    <SidebarMenuItem>
                                        <SidebarMenuButton>
                                            {item.icon && <item.icon/>}
                                            <span>{item.title}</span>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                )
                            ))}
                        </SidebarMenu>
                    </SidebarGroup>
                ))}
            </SidebarContent>
            <SidebarRail/>
        </Sidebar>
    )
}