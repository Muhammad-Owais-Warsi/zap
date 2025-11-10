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

            {/*<div className="space-y-1">
                {!showCreateFolder ? (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => setShowCreateFolder(true)}
                    >
                        <Folder className="w-4 h-4 mr-2" />
                        New Folder
                    </Button>
                ) : (
                    <div className="flex gap-1">
                        <Input
                            placeholder="Folder name"
                            value={folderName}
                            onChange={(e) => setFolderName(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") handleCreateFolder();
                                if (e.key === "Escape") {
                                    setShowCreateFolder(false);
                                    setFolderName("");
                                }
                            }}
                            className="h-8"
                            autoFocus
                        />
                        <Button
                            size="sm"
                            onClick={handleCreateFolder}
                            className="h-8 px-2"
                        >
                            ✓
                        </Button>
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                                setShowCreateFolder(false);
                                setFolderName("");
                            }}
                            className="h-8 px-2"
                        >
                            ✕
                        </Button>
                    </div>
                )}

                {!showCreateFile ? (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => setShowCreateFile(true)}
                    >
                        <File className="w-4 h-4 mr-2" />
                        New File
                    </Button>
                ) : (
                    <div className="flex gap-1">
                        <Input
                            placeholder="File name"
                            value={fileName}
                            onChange={(e) => setFileName(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") handleCreateFile();
                                if (e.key === "Escape") {
                                    setShowCreateFile(false);
                                    setFileName("");
                                }
                            }}
                            className="h-8"
                            autoFocus
                        />
                        <Button
                            size="sm"
                            onClick={handleCreateFile}
                            className="h-8 px-2"
                        >
                            ✓
                        </Button>
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                                setShowCreateFile(false);
                                setFileName("");
                            }}
                            className="h-8 px-2"
                        >
                            ✕
                        </Button>
                    </div>
                )}
            </div>*/}
        </div>
    );
}

//TODO
// add folder and file create func on sidebar icon coz i moved from headers
// work on import
// then setting env
