import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import TabBlock from "./tab-block";
import { createZapRequest } from "@/file-system/fs-operation";
import { Plus } from "lucide-react";
import { useTabsStore } from "@/store/new/tabs-store";
import { FileSystemOperations } from "@/lib/fs/fs";
import { useFileSystemStore } from "@/store/new/file-system";
import { useCwdStore } from "@/store/new/cwd-store";

export default function PlaygroundTabs() {
    const workspace = useCwdStore().workspace;
    const tabs = useTabsStore().tabs;
    const setActiveFile = useFileSystemStore().setActiveFile;

    async function handleNewTab() {
        const name = `NEW_REQUEST_${Date.now()}`;

        if (!workspace) return;

        await createZapRequest(name, workspace);
        FileSystemOperations.createFileAndOpenTab(workspace, name);
        console.log("NEW", `${workspace}/${name}.json`);
        setActiveFile(`${workspace}/${name}.json`);
    }

    return (
        <div className="flex items-center border-b border-border bg-background/80 backdrop-blur-sm h-[44.5px]">
            <ScrollArea className="flex-1 whitespace-nowrap w-2.5">
                <div className="flex items-center ">
                    {tabs.map((tab, idx) => (
                        <TabBlock
                            key={idx}
                            name={tab.name}
                            path={tab.path}
                            method={tab.method}
                        />
                    ))}
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>

            <div className="border-l border-border shrink-0">
                <Button
                    variant="ghost"
                    className="rounded-none h-[44.5px] px-3 flex items-center gap-2 hover:cursor-pointer"
                    onClick={handleNewTab}
                >
                    <Plus className="h-4 w-4" />
                    <span>Add New</span>
                </Button>
            </div>
        </div>
    );
}
