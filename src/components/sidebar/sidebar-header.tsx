import {
    createZapFolder,
    createZapWorkspace,
    createZapRequest,
} from "@/file-system/fs-operation";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useCwdStore } from "@/store/cwd-store";
import { useState } from "react";
import { Folder, File, ImportIcon } from "lucide-react";
import { useTabsStore } from "@/store/tabs-store";
import { WorkspaceSwitcher } from "../workspace/switcher";
import { Plus } from "lucide-react";
import { Separator } from "../ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { SidebarSeparator } from "../ui/sidebar";
import CreateFolder from "../fs/folder";
import CreateRequest from "../fs/file";

export default function SideHeaders({ workspace }: { workspace: string }) {
    const updateName = useCwdStore((state) => state.updateName);
    const resetCwdStore = useCwdStore((state) => state.resetCwdStore);
    const resetTabsStore = useTabsStore((state) => state.resetTabStore);
    const triggerWorkspaceUpdate = useCwdStore(
        (state) => state.triggerWorkspaceUpdate,
    );

    const [showCreateFolder, setShowCreateFolder] = useState(false);
    const [showCreateFile, setShowCreateFile] = useState(false);
    const [folderName, setFolderName] = useState("");
    const [fileName, setFileName] = useState("");

    const handleCreateFolder = async () => {
        if (!folderName.trim()) return;
        await createZapFolder(folderName.trim(), workspace);
        setFolderName("");
        setShowCreateFolder(false);
        triggerWorkspaceUpdate();
    };

    const handleCreateFile = async () => {
        if (!fileName.trim()) return;
        await createZapRequest(fileName.trim(), workspace);
        setFileName("");
        setShowCreateFile(false);
        triggerWorkspaceUpdate();
    };

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

                <Tooltip>
                    <TooltipTrigger>
                        <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={handleCreateWorkspace}
                            className="flex items-center gap-2 hover:cursor-pointer"
                        >
                            <ImportIcon />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Import Request</TooltipContent>
                </Tooltip>
                <CreateFolder />
                <CreateRequest />
            </div>

            <div className="-mx-2 border-t border-sidebar-border mt-1" />
        </div>
    );
}
