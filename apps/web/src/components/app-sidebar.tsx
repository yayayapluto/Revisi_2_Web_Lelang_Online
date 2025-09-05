import * as React from "react"
import {BookOpen, Bot, BoxIcon, ChevronRight, Settings2, Wheat} from "lucide-react"

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
            url: '/dashboard/object-type',
            icon: BoxIcon,
            items: [
                {
                    title: "Dashboard",
                    url: "/dashboard/object-type",
                },
                {
                    title: 'List',
                    url: '/dashboard/object-type/list',
                },
                {
                    title: 'Add New',
                    url: '/dashboard/object-type/create',
                },
            ],
        },
        {
            title: 'Models',
            url: '#',
            icon: Bot,
            items: [
                {
                    title: 'Genesis',
                    url: '#',
                },
                {
                    title: 'Explorer',
                    url: '#',
                },
                {
                    title: 'Quantum',
                    url: '#',
                },
            ],
        },
        {
            title: 'Documentation',
            url: '#',
            icon: BookOpen,
            items: [
                {
                    title: 'Introduction',
                    url: '#',
                },
                {
                    title: 'Get Started',
                    url: '#',
                },
                {
                    title: 'Tutorials',
                    url: '#',
                },
                {
                    title: 'Changelog',
                    url: '#',
                },
            ],
        },
        {
            title: 'Settings',
            url: '#',
            icon: Settings2,
            items: [
                {
                    title: 'General',
                    url: '#',
                },
                {
                    title: 'Team',
                    url: '#',
                },
                {
                    title: 'Billing',
                    url: '#',
                },
                {
                    title: 'Limits',
                    url: '#',
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


// export const AppSideBar = () => {
//     const isMobile = useIsMobile();
//     const [activeTeam, setActiveTeam] = React.useState(DATA.teams[0]);
//
//     if (!activeTeam) return null;
//
//     return (
//         <SidebarProvider>
//
//
//             <SidebarInset>
//                 <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
//                     <div className="flex items-center gap-2 px-4">
//                         <SidebarTrigger className="-ml-1" />
//                         <Separator orientation="vertical" className="mr-2 h-4" />
//                         <Breadcrumb>
//                             <BreadcrumbList>
//                                 <BreadcrumbItem className="hidden md:block">
//                                     <BreadcrumbLink href="#">
//                                         Building Your Application
//                                     </BreadcrumbLink>
//                                 </BreadcrumbItem>
//                                 <BreadcrumbSeparator className="hidden md:block" />
//                                 <BreadcrumbItem>
//                                     <BreadcrumbPage>Data Fetching</BreadcrumbPage>
//                                 </BreadcrumbItem>
//                             </BreadcrumbList>
//                         </Breadcrumb>
//                     </div>
//                 </header>
//                 <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
//                     <div className="grid auto-rows-min gap-4 md:grid-cols-3">
//                         <div className="aspect-video rounded-xl bg-muted/50" />
//                         <div className="aspect-video rounded-xl bg-muted/50" />
//                         <div className="aspect-video rounded-xl bg-muted/50" />
//                     </div>
//                     <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
//                 </div>
//             </SidebarInset>
//         </SidebarProvider>
//     );
// };