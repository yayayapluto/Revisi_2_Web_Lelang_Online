import {createFileRoute, Link, Outlet, useLocation} from "@tanstack/react-router";
import {SidebarInset, SidebarProvider, SidebarTrigger} from "@/components/animate-ui/radix/sidebar";
import {Separator} from "@/components/ui/separator";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import {AppSidebar} from "@/components/app-sidebar";
import {ModeToggle} from "@/components/mode-toggle";
import {AnimatePresence, motion} from "motion/react";

export const Route = createFileRoute('/dashboard')({
    component: RouteComponent,
})

function RouteComponent() {
    const location = useLocation()
    const paths = location.pathname.split("/").filter(Boolean)
    return (
        <SidebarProvider>
            <AppSidebar/>
            <SidebarInset className={"min-w-0"}>
                <header className="flex py-2 shrink-0 items-center gap-2 border-b top-0 z-1 sticky bg-background">
                    <div className="w-full flex items-center justify-between pr-6">
                        <div className="flex items-center gap-2 px-3">
                            <SidebarTrigger/>
                            <Separator orientation="vertical" className="mr-2 h-4"/>
                            <Breadcrumb>
                                <BreadcrumbList>
                                    {paths.map((path, idx) => {
                                        const to = "/" + paths.slice(0, idx + 1).join("/")
                                        const isLast = idx === paths.length - 1
                                        const isFirst = idx === 0
                                        const pathFormatted = path.split("-").map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(" ")

                                        return (
                                            <>
                                                {!isFirst && <BreadcrumbSeparator/>}
                                                <BreadcrumbItem key={to}>
                                                    {
                                                        isLast ? (
                                                            <BreadcrumbPage>{pathFormatted}</BreadcrumbPage>
                                                        ) : (
                                                            <BreadcrumbLink asChild>
                                                                <Link to={to}>{pathFormatted}</Link>
                                                            </BreadcrumbLink>
                                                        )
                                                    }
                                                </BreadcrumbItem>
                                            </>
                                        )
                                    })}
                                </BreadcrumbList>
                            </Breadcrumb>
                        </div>
                        <ModeToggle/>
                    </div>
                </header>
                <div className="w-full max-w-screen h-full p-4 md:p-6">
                    <AnimatePresence mode={"wait"}>
                        <motion.div
                            key={location.pathname}
                            initial={{opacity: 0}}
                            animate={{opacity: 1}}
                            exit={{opacity: 0}}
                            transition={{duration: 0.2, ease: "easeIn"}}
                            className={"w-full"}
                            layout
                        >
                            <Outlet/>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}