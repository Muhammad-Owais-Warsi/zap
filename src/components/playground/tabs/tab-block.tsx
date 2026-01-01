// import { getZapFileContent } from "@/file-system/fs-operation";
// import { useCwdStore } from "@/store/cwd-store";
import { Button } from "@/components/ui/button";
import ignoreExt from "@/lib/ignore-extension";
// import { useZapRequest } from "@/store/request-store";
import { X } from "lucide-react";
import MethodBadge from "@/components/theme/method-badge";
import { ZapHttpMethods } from "@/types/request";
import { useTabsStore } from "@/store/new/tabs-store";
import { FileSystemOperations } from "@/lib/fs/fs";
// import { useFileSystemStore } from "@/store/new/file-system";
export default function TabBlock({
    name,
    path,
    method,
}: {
    name: string;
    path: string;
    method?: ZapHttpMethods;
}) {
    // const setSelectedFile = useCwdStore((state) => state.setSelectedFile);
    const activeTab = useTabsStore().activeTab;
    // const setActiveTab = useTabsStore().setActiveTab;
    // const setActiveFile = useFileSystemStore().setActiveFile;
    // const setRequest = useZapRequest((state) => state.setRequest);
    // const getRequest = useZapRequest((state) => state.getRequest);

    console.log(method);

    async function handleTabClick() {
        if (activeTab?.path === path) return;

        // const content = getRequest(path);

        // if (content) {
        //     setSelectedFile(path, JSON.stringify(content));
        //     setRequest(content, path)
        //     // return;
        // }

        if (method)
            FileSystemOperations.clickTabAndSetActiveFile(path, name, method);

        // if content is undefined then readme_content is the only one we have to read
        // const readme_content = await getZapFileContent(path);
        // setSelectedFile(path, JSON.parse(readme_content.message));
        // setActiveTab(path, name, content?.method as ZapHttpMethods);
    }

    async function handleCloseTab(e: React.MouseEvent) {
        e.stopPropagation();
        FileSystemOperations.closeTabAndSetActiveFile(path);

        // const { activeTab: newActiveTab } = useTabsStore.getState();
        // if (newActiveTab) {
        //     const content = await getZapFileContent(newActiveTab?.path);
        //     setSelectedFile(newActiveTab?.path, content.message);
        // } else {
        //     setSelectedFile(null as unknown as string, "");
        // }
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
