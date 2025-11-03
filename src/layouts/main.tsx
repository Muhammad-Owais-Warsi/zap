import PlaygroundFooter from "@/components/playground/footer";
import Render from "@/components/playground/render";
import PlaygroundTabs from "@/components/playground/tabs/tabs";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import { WorkspaceSwitcher } from "@/components/workspace/switcher";
import { Loader } from "lucide-react";
// import { useCwdStore } from "@/store/cwd-store";

interface AppLayoutProps {
    workspace: string;
}

export default function MainLayout({ workspace }: AppLayoutProps) {
    if (!workspace) {
        return <Loader className="animate-spin" />;
    }

    return (
        <SidebarProvider>
            <AppSidebar workspace={workspace} />
            <SidebarInset>
                <main className="flex flex-1 flex-col min-h-0 overflow-hidden">
                    <Render />
                </main>
                <PlaygroundFooter />
            </SidebarInset>
        </SidebarProvider>
    );
}
// {/*<header className="flex h-16 shrink-0 items-center gap-2">
//     {/*<div className="flex items-center gap-2 px-4">
//         {/*<PlaygroundTabs />*/}
//         {/*<WorkspaceSwitcher />*/}
//     </div>*/}
// </header>*/}
