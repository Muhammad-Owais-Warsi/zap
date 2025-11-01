import { SidebarTrigger } from "../ui/sidebar";

export default function PlaygroundFooter() {
    return (
        <footer className="sticky bottom-0 w-full border-t border-border bg-background flex justify-between items-center px-6 py-3">
            <SidebarTrigger className="-ml-1" />
        </footer>
    );
}
