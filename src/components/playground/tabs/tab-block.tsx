import { useTabsStore } from "@/store/tabs-store";
import { getZapFileContent } from "@/file-system/fs-operation";
import { useCwdStore } from "@/store/cwd-store";
import { Button } from "@/components/ui/button";
import ignoreExt from "@/lib/ignore-extension";
import { useZapRequest } from "@/store/request-store";
import { X } from "lucide-react";
import MethodBadge from "@/components/theme/method-badge";
export default function TabBlock({
    name,
    path,
}: {
    name: string;
    path: string;
}) {
    const setSelectedFile = useCwdStore((state) => state.setSelectedFile);
    const { setActiveTab, activeTab, closeTab } = useTabsStore();
    const setRequest = useZapRequest((state) => state.setRequest);
    const getRequest = useZapRequest((state) => state.getRequest);
    const method = useZapRequest((state) => state.getRequest(path)?.method);

    async function handleTabClick() {
        if (activeTab?.path === path) return;
        const content = getRequest(path);
        setSelectedFile(path, JSON.stringify(content));
        if (content) {
            setRequest(content, path);
        }
        setActiveTab({ name, path });
    }

    async function handleCloseTab(e: React.MouseEvent) {
        e.stopPropagation();
        closeTab(path);

        const { activeTab: newActiveTab } = useTabsStore.getState();
        if (newActiveTab) {
            const content = await getZapFileContent(newActiveTab.path);
            setSelectedFile(newActiveTab.path, content.message);
        } else {
            setSelectedFile(null as unknown as string, "");
        }
    }

    const isActive = activeTab?.path === path;

    return (
        <div
            onClick={handleTabClick}
            className={`group inline-flex items-center gap-2 px-4 py-2 border-b-2 cursor-pointer select-none h-10
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
