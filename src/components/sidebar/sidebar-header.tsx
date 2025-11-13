import {
    createZapFolder,
    createZapWorkspace,
    createZapRequest,
} from "@/file-system/fs-operation";
import { Button } from "../ui/button";
import { useCwdStore } from "@/store/cwd-store";

import { useTabsStore } from "@/store/tabs-store";
import { WorkspaceSwitcher } from "../workspace/switcher";
import { Plus } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import CreateFolder from "../fs/folder";
import CreateRequest from "../fs/file";
import ImportRequest from "../fs/import";

export default function SideHeaders({ workspace }: { workspace: string }) {
    const updateName = useCwdStore((state) => state.updateName);
    const resetCwdStore = useCwdStore((state) => state.resetCwdStore);
    const resetTabsStore = useTabsStore((state) => state.resetTabStore);

    const handleCreateWorkspace = async () => {
        console.log(await createZapWorkspace("hello_new_zap"));
        resetCwdStore();
        resetTabsStore();
        updateName("hello_new_zap");
    };

    return (
        <div className="">
            <div className="flex items-center justify-start gap-2">
                <WorkspaceSwitcher />
                <Tooltip>
                    <TooltipTrigger>
                        <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={handleCreateWorkspace}
                            className="flex items-center gap-2 hover:cursor-pointer"
                        >
                            <Plus />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>New Workspace</TooltipContent>
                </Tooltip>

                <ImportRequest />
                <CreateFolder />
                <CreateRequest />
            </div>

            <div className="-mx-2 border-t border-sidebar-border mt-1" />
        </div>
    );
}
