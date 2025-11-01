import { Button } from "@/components/ui/button";
import { useTabsStore } from "@/store/tabs-store";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import TabBlock from "./tab-block";
import { useCwdStore } from "@/store/cwd-store";
import {
    createZapRequest,
    getZapFileContent,
} from "@/file-system/fs-operation";
import { useZapRequest } from "@/store/request-store";
import { Plus } from "lucide-react";

export default function PlaygroundTabs() {
    const tabs = useTabsStore((state) => state.tabs);
    const setRequest = useZapRequest((state) => state.setRequest);
    const workspace = useCwdStore((state) => state.name);
    const triggerWorkspaceUpdate = useCwdStore(
        (state) => state.triggerWorkspaceUpdate,
    );
    const addNewTab = useTabsStore((state) => state.addNewTab);
    const setSelectedFile = useCwdStore((state) => state.setSelectedFile);

    async function handleNewTab() {
        const name = `NEW_REQUEST_${Date.now().toString()}`;

        if (workspace) {
            await createZapRequest(name, workspace);
            const content = await getZapFileContent(
                `${workspace}/${name}.json`,
            );
            setRequest(JSON.parse(content.message), workspace);
            triggerWorkspaceUpdate();
            addNewTab({ name: `${name}.json`, path: workspace });
            setSelectedFile(workspace, content.message);
        }
    }

    return (
        <div className="flex items-center border-b border-border bg-background/80 backdrop-blur-sm">
            {/* Scrollable Tabs */}
            <ScrollArea className="flex-1 w-[350px] whitespace-nowrap">
                <div className="flex items-center">
                    {tabs.map((v, k) => (
                        <TabBlock key={k} name={v.name} path={v.path} />
                    ))}
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>

            {/* Sticky Add Tab Button */}
            <div className="border-l border-border shrink-0">
                <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-none h-10 w-10"
                    onClick={handleNewTab}
                >
                    <Plus className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
