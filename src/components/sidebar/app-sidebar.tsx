import * as React from "react";
import { NavMain } from "@/components/sidebar/nav-main";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
} from "@/components/ui/sidebar";
import { useWorkspaceRecursive } from "@/hooks/useWorkspace";
import SideHeaders from "./sidebar-header";

import { useEffect } from "react";

import { ModeToggle } from "../theme/theme-toggle";
import SidebarSettings from "./sidebar-settings";
import { useFileSystemStore } from "@/store/new/file-system";
import { useRef } from "react";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
    workspace: string;
}

export function AppSidebar({ workspace, ...props }: AppSidebarProps) {
    console.log("AppSidebar re-rendered");
    const { entries, loading } = useWorkspaceRecursive(workspace);
    console.log(entries);
    const setAllEntries = useFileSystemStore().setAllFiles;
    const files = useFileSystemStore((state) => state.files);
    console.log("HERE", files);

    const initialized = useRef(false);

    useEffect(() => {
        if (entries && entries.length > 0) {
            setAllEntries(entries);
        }
    }, [entries, setAllEntries]);

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
                <NavMain items={files} workspace={workspace} />
            </SidebarContent>
            <SidebarFooter className="border-t border-border p-3 flex flex-row justify-between items-center">
                <ModeToggle />

                <SidebarSettings />
            </SidebarFooter>
        </Sidebar>
    );
}
