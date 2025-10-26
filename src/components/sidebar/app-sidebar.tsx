import * as React from "react";
import { NavMain } from "@/components/sidebar/nav-main";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from "@/components/ui/sidebar";
import { entriesType, useWorkspaceRecursive } from "@/hooks/useWorkspace";
import SideHeaders from "./sidebar-header";
import { useZapRequest } from "@/store/request-store";
import { useEffect } from "react";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
    workspace: string;
}

export function AppSidebar({ workspace, ...props }: AppSidebarProps) {
    const { entries, loading } = useWorkspaceRecursive(workspace);
    const setPathAndName = useZapRequest((state) => state.setPathAndName);
    console.log("AppSidebar re-rendered");
    console.log(entries);

    useEffect(() => {
        function initRequests(items: entriesType[]) {
            items?.forEach((file) => {
                if (!file.isDir) {
                    setPathAndName(file.path, file.name);
                }

                if (file.isDir && file.items) {
                    initRequests(file.items);
                }
            });
        }

        initRequests(entries);
    }, [entries, setPathAndName]);

    if (loading)
        return (
            <Sidebar collapsible="offcanvas" {...props}>
                Loading...
            </Sidebar>
        );

    return (
        <Sidebar collapsible="offcanvas" {...props}>
            <SidebarHeader>
                <SideHeaders workspace={workspace} />
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={entries} workspace={workspace} />
            </SidebarContent>
            <SidebarRail />
        </Sidebar>
    );
}
