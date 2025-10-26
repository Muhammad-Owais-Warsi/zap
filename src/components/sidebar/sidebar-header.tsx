import {
    createZapFolder,
    createZapWorkspace,
    createZapRequest,
} from "@/file-system/fs-operation";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useCwdStore } from "@/store/cwd-store";
import { useState } from "react";
import { Plus, Folder, File } from "lucide-react";
import { useTabsStore } from "@/store/tabs-store";

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
        await createZapWorkspace("new");
        resetCwdStore();
        resetTabsStore();
        updateName("new");
    };

    return (
        <div className="p-2 space-y-2">
            <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={handleCreateWorkspace}
            >
                <Plus className="w-4 h-4 mr-2" />
                New Workspace
            </Button>

            <div className="space-y-1">
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
            </div>
        </div>
    );
}
