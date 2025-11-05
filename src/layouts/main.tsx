import PlaygroundFooter from "@/components/playground/footer";
import Render from "@/components/playground/render";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Loader } from "lucide-react";

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
