import { Button } from "@/components/ui/button";
import ignoreExt from "@/lib/ignore-extension";
import { X } from "lucide-react";
import MethodBadge from "@/components/theme/method-badge";
import { ZapHttpMethods } from "@/types/request";
import { useTabsStore } from "@/store/tabs-store";
import { FileSystemOperations } from "@/lib/fs/fs";
export default function TabBlock({
    name,
    path,
    method,
}: {
    name: string;
    path: string;
    method?: ZapHttpMethods;
}) {
    const activeTab = useTabsStore().activeTab;

    async function handleTabClick() {
        if (activeTab?.path === path) return;
        FileSystemOperations.clickTabAndSetActiveFile(path, name, method);
    }

    async function handleCloseTab(e: React.MouseEvent) {
        e.stopPropagation();
        FileSystemOperations.closeTabAndSetActiveFile(path);
    }

    const isActive = activeTab?.path === path;

    return (
        <div
            onClick={handleTabClick}
            className={`group inline-flex items-center gap-2 px-4 py-2 border-b-2 cursor-pointer select-none h-[44.5px]
              ${
                  isActive
                      ? "border-primary text-primary font-medium bg-background"
                      : "border-transparent text-muted-foreground"
              }`}
        >
            <span className="truncate max-w-[140px]">{ignoreExt(name)}</span>
            {method && <MethodBadge method={method} />}

            <Button
                onClick={handleCloseTab}
                variant="ghost"
                size="icon-tab"
                className="hover:cursor-pointer"
            >
                <X className="h-3 w-3" />
            </Button>
        </div>
    );
}
