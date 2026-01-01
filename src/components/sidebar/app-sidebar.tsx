import * as React from "react";
import { NavMain } from "@/components/sidebar/nav-main";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
} from "@/components/ui/sidebar";
import { entriesType, useWorkspaceRecursive } from "@/hooks/useWorkspace";
import SideHeaders from "./sidebar-header";
import { useZapRequest } from "@/store/request-store";
import { useEffect } from "react";
import { IGNORED_FILES } from "@/lib/ignored-files";
import { ModeToggle } from "../theme/theme-toggle";
import SidebarSettings from "./sidebar-settings";
import { useFileSystemStore } from "@/store/new/file-system";
import { useRef } from "react";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
    workspace: string;
}

export function AppSidebar({ workspace, ...props }: AppSidebarProps) {
    // const setPathAndName = useZapRequest((state) => state.setPathAndName);
    console.log("AppSidebar re-rendered");
    const { entries, loading } = useWorkspaceRecursive(workspace);
    console.log(entries);
    const setAllEntries = useFileSystemStore().setAllFiles;
    const files = useFileSystemStore((state) => state.files);
    console.log("HERE", files);

    // Only set Zustand store the first time entries is loaded
    const initialized = useRef(false);

    useEffect(() => {
        if (!initialized.current && entries && entries.length > 0) {
            setAllEntries(entries);
            initialized.current = true;
        }
    }, [entries, setAllEntries]);

    // useEffect(() => {
    //     function initRequests(items: entriesType[]) {
    //         items
    //             ?.filter((file) => !IGNORED_FILES.includes(file.name))
    //             .forEach((file) => {
    //                 if (!file.isDir) {
    //                     setPathAndName(file.path, file.name);
    //                 }

    //                 if (file.isDir && file.items) {
    //                     initRequests(file.items);
    //                 }
    //             });
    //     }

    //     initRequests(entries);
    //     // setAllEntries(entries)
    // }, [entries, setPathAndName]);

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
