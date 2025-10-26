import { useTabsStore } from "@/store/tabs-store";
import { getZapFileContent } from "@/file-system/fs-operation";
import { useCwdStore } from "@/store/cwd-store";
import { Button } from "@/components/ui/button";
import ignoreExt from "@/lib/ignore-extension";

export default function TabBlock({
    name,
    path,
}: {
    name: string;
    path: string;
}) {
    const setSelectedFile = useCwdStore((state) => state.setSelectedFile);

    const { setActiveTab, activeTab, closeTab } = useTabsStore();

    async function handleTabClick() {
        if (activeTab?.path === path) return;

        const content = await getZapFileContent(path);
        setSelectedFile(path, content.message);

        setActiveTab({
            name,
            path,
        });
    }

    async function handleCloseTab() {
        closeTab(path);

        const { activeTab: newActiveTab } = useTabsStore.getState();
        if (newActiveTab) {
            const content = await getZapFileContent(newActiveTab?.path);
            setSelectedFile(newActiveTab?.path, content.message);
        } else {
            setSelectedFile(null as unknown as string, "");
        }
    }

    return (
        <div className="flex items-center justify-between px-3 py-1 rounded-md">
            <span
                className="text-sm font-medium truncate"
                onClick={() => handleTabClick()}
            >
                {ignoreExt(name)}
            </span>
            <Button onClick={() => handleCloseTab()}>x</Button>
        </div>
    );
}
