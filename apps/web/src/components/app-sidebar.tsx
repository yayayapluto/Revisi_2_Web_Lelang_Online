import * as React from "react"
import {BoxIcon, ChevronRight, FileTextIcon, Wheat} from "lucide-react"

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

const DATA = {
    navMain: [
        {
            title: 'Object Type',
            url: '#',
            icon: BoxIcon,
            items: [
                {
                    title: 'List',
                    url: "/dashboard/object-type",
                },
                {
                    title: 'Add New',
                    url: "#",
                },
            ],
        },
        {
            title: 'Item',
            url: '#',
            icon: FileTextIcon,
            items: [
                {
                    title: 'List',
                    url: "/dashboard/item",
                },
                {
                    title: 'Add New',
                    url: "#",
                },
            ],
        },
    ],
};

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
                {/* Nav Main */}
                <SidebarGroup>
                    <SidebarGroupLabel>Dashboards</SidebarGroupLabel>
                    <SidebarMenu>
                        {DATA.navMain.map((item) => (
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
                                                            <Link to={subItem.url} className={"capitalize"}>{subItem.title}</Link>
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
                {/* Nav Main */}
            </SidebarContent>
            <SidebarRail/>
        </Sidebar>
    )
}