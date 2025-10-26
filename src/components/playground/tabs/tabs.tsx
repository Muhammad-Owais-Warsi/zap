import { Button } from "@/components/ui/button";
import { useTabsStore } from "@/store/tabs-store";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import TabBlock from "./tab-block";
import { useCwdStore } from "@/store/cwd-store";
import { createZapRequest } from "@/file-system/fs-operation";

export default function PlaygroundTabs() {
    const tabs = useTabsStore((state) => state.tabs);
    const workspace = useCwdStore((state) => state.name);
    const triggerWorkspaceUpdate = useCwdStore(
        (state) => state.triggerWorkspaceUpdate,
    );
    const addNewTab = useTabsStore((state) => state.addNewTab);

    async function handleNewTab() {
        const name = `NEW_REQUEST_${Date.now().toString()}`;
        console.log(workspace);
        if (workspace) {
            await createZapRequest(name, workspace);
            addNewTab({ name, path: workspace });
        }

        triggerWorkspaceUpdate();
    }

    return (
        <ScrollArea className="w-96 rounded-md border whitespace-nowrap">
            <div className="flex w-max space-x-4 p-4">
                {tabs.map((v, k) => (
                    <TabBlock name={v.name} path={v.path} key={k} />
                ))}
            </div>
            <ScrollBar orientation="horizontal" />
            <Button onClick={() => handleNewTab()}>add new tab</Button>
        </ScrollArea>
    );
}
