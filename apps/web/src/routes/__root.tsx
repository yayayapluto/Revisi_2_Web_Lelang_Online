import Loader from "@/components/loader";
import {ThemeProvider} from "@/components/theme-provider";
import {Toaster} from "@/components/ui/sonner";
import {createRootRouteWithContext, HeadContent, Outlet, useRouterState,} from "@tanstack/react-router";
import "../index.css";

export interface RouterAppContext {
}

export const Route = createRootRouteWithContext<RouterAppContext>()({
    component: RootComponent,
    head: () => ({
        meta: [
            {
                title: "Revisi_2_Web_Lelang_Online",
            },
            {
                name: "description",
                content: "Revisi_2_Web_Lelang_Online is a web application",
            },
        ],
        links: [
            {
                rel: "icon",
                href: "/favicon.ico",
            },
        ],
    }),
});

function RootComponent() {
    const isFetching = useRouterState({
        select: (s) => s.isLoading,
    });

    return (
        <>
            <HeadContent/>
            <ThemeProvider
                attribute="class"
                defaultTheme="dark"
                disableTransitionOnChange
                storageKey="vite-ui-theme"
            >
                <div className="grid grid-rows-[auto_1fr] h-full max-w-screen">
                    {/*<Header />*/}
                    {isFetching
                        ? <Loader/>
                        : <Outlet/>}
                </div>
                <Toaster richColors/>
            </ThemeProvider>
            {/*<TanStackRouterDevtools position="bottom-left" />*/}
        </>
    );
}
