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
    const addNewTab = useTabsStore((state) => state.addNewTab);

    const setRequest = useZapRequest((state) => state.setRequest);
    const workspace = useCwdStore((state) => state.name);
    const triggerWorkspaceUpdate = useCwdStore(
        (state) => state.triggerWorkspaceUpdate,
    );
    const setSelectedFile = useCwdStore((state) => state.setSelectedFile);

    async function handleNewTab() {
        const name = `NEW_REQUEST_${Date.now()}`;

        if (!workspace) return;

        await createZapRequest(name, workspace);
        const content = await getZapFileContent(`${workspace}/${name}.json`);

        const json = JSON.parse(content.message);
        setRequest(json, workspace);
        addNewTab({ name: `${name}.json`, path: `${workspace}/${name}.json` });
        setSelectedFile(`${workspace}/${name}.json`, content.message);
        triggerWorkspaceUpdate();
    }

    return (
        <div className="flex items-center border-b border-border bg-background/80 backdrop-blur-sm h-[44.5px]">
            <ScrollArea className="flex-1 whitespace-nowrap w-2.5">
                <div className="flex items-center ">
                    {tabs.map((tab, idx) => (
                        <TabBlock key={idx} name={tab.name} path={tab.path} />
                    ))}
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>

            <div className="border-l border-border shrink-0">
                <Button
                    variant="ghost"
                    className="rounded-none h-10 px-3 flex items-center gap-2 hover:cursor-pointer"
                    onClick={handleNewTab}
                >
                    <Plus className="h-4 w-4" />
                    <span>Add New</span>
                </Button>
            </div>
        </div>
    );
}
