import { ChevronRight, Plus } from "lucide-react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
} from "@/components/ui/sidebar";
import { type entriesType } from "@/hooks/useWorkspace";
import ignoreExt from "@/lib/ignore-extension";
import { useEffect, useState } from "react";
import { useCwdStore } from "@/store/cwd-store";
import { useTabsStore } from "@/store/tabs-store";
import {
    createZapRequest,
    getZapFileContent,
    moveZapRequest,
    renameZapRequest,
} from "@/file-system/fs-operation";
import { Button } from "../ui/button";
import { IGNORED_FILES } from "@/lib/ignored-files";
import { useZapRequest } from "@/store/request-store";
import MethodBadge from "../theme/method-badge";

type DragItem = { path: string; isDir: boolean; name: string };

function DraggableFile({
    file,
    handleFileClick,
    setSourceTarget,
    triggerWorkspaceUpdate,
}: {
    file: entriesType;
    handleFileClick: (path: string, name: string) => Promise<void>;
    setSourceTarget: (st: { source?: DragItem; target?: string }) => void;
    triggerWorkspaceUpdate: () => void;
}) {
    const [isRenaming, setIsRenaming] = useState(false);
    const [newName, setNewName] = useState(file.name.split(".")[0]);

    const [{ isDragging }, drag] = useDrag(() => ({
        type: "FILE",
        item: { path: file.path, isDir: file.isDir, name: file.name },
        collect: (monitor) => ({ isDragging: monitor.isDragging() }),
        canDrag: () => !file.isDir && !isRenaming,
    }));

    const [{ isOver }, drop] = useDrop<DragItem>({
        accept: "FILE",
        hover: (item) => {
            if (item.path !== file.path) {
                const targetDir = file.isDir
                    ? file.path
                    : file.path.split("/").slice(0, -1).join("/");
                setSourceTarget({ source: item, target: targetDir });
            }
        },
        drop: async (item) => {
            if (item.path !== file.path) {
                const targetDir = file.isDir
                    ? file.path
                    : file.path.split("/").slice(0, -1).join("/");
                try {
                    await moveZapRequest(item, targetDir);
                    triggerWorkspaceUpdate();
                } catch (err) {
                    console.error("Failed to move file:", err);
                }
            }
        },
        canDrop: (item) => item.path !== file.path,
    });

    const method = useZapRequest(
        (state) => state.getRequest(file.path)?.method,
    );

    const selectedFile = useCwdStore((state) => state.selectedFile);

    const handleRename = async () => {
        if (!newName.trim() || newName === file.name) return;
        try {
            await renameZapRequest(file.path, newName);
            triggerWorkspaceUpdate();
            setIsRenaming(false);
        } catch (err) {
            console.error("Rename failed:", err);
        }
    };

    return (
        <SidebarMenuItem
            ref={(node) => drag(drop(node))}
            style={{ opacity: isDragging ? 0.5 : 1 }}
            className={isOver ? "bg-muted" : ""}
        >
            {isRenaming ? (
                <input
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    onBlur={handleRename}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") handleRename();
                        if (e.key === "Escape") setIsRenaming(false);
                    }}
                    autoFocus
                    className="bg-transparent border-b border-primary/50 px-1 text-sm focus:outline-none w-full"
                />
            ) : (
                <SidebarMenuButton
                    className={`flex items-center justify-between rounded-sm ${
                        selectedFile?.path === file.path
                            ? "bg-primary/10 text-primary border-primary"
                            : "hover:bg-muted"
                    }`}
                    onClick={() => handleFileClick(file.path, file.name)}
                    onDoubleClick={() => setIsRenaming(true)}
                >
                    <span className="flex-1 truncate text-left">
                        {ignoreExt(file.name)}
                    </span>
                    {method && (
                        <div className="shrink-0 ml-2">
                            <MethodBadge method={method} />
                        </div>
                    )}
                </SidebarMenuButton>
            )}
        </SidebarMenuItem>
    );
}

interface FolderDropAreaProps {
    folder: entriesType;
    children: React.ReactNode;
    setSourceTarget: (st: { source?: DragItem; target?: string }) => void;
    triggerWorkspaceUpdate: () => void;
}

export function FolderDropArea({
    folder,
    children,
    setSourceTarget,
    triggerWorkspaceUpdate,
}: FolderDropAreaProps) {
    const [{ isOver }, drop] = useDrop<DragItem>({
        accept: "FILE",
        hover: (item) => {
            if (!item || item.path === folder.path) return;
            setSourceTarget({ source: item, target: folder.path });
        },
        drop: async (item) => {
            if (!item || item.isDir || item.path === folder.path) return;
            try {
                await moveZapRequest(item, folder.path);
                triggerWorkspaceUpdate();
            } catch (err) {
                console.error("Failed to move file:", err);
            }
        },
        canDrop: (item) => !!item && !item.isDir && item.path !== folder.path,
        collect: (monitor) => ({ isOver: monitor.isOver({ shallow: true }) }),
    });

    return (
        <SidebarMenuSub ref={drop} className={`${isOver ? "bg-muted/50" : ""}`}>
            {children}
        </SidebarMenuSub>
    );
}

function NavMainContent({
    items,
    workspace,
}: {
    items: entriesType[];
    workspace: string;
}) {
    const [sourceTarget, setSourceTarget] = useState<{
        source?: DragItem;
        target?: string;
    }>({});
    const selectedFile = useCwdStore((state) => state.selectedFile);
    const setRequest = useZapRequest((state) => state.setRequest);
    const setSelectedFile = useCwdStore((state) => state.setSelectedFile);
    const activeTab = useTabsStore((state) => state.activeTab);
    const setActiveTab = useTabsStore((state) => state.setActiveTab);
    const triggerWorkspaceUpdate = useCwdStore(
        (state) => state.triggerWorkspaceUpdate,
    );

    useEffect(() => {
        const fetchFileContent = async () => {
            if (activeTab && selectedFile?.path) {
                try {
                    const content = await getZapFileContent(selectedFile.path);
                    setRequest(JSON.parse(content.message), selectedFile.path);
                } catch (err) {
                    console.error("Failed to load file content:", err);
                }
            }
        };

        fetchFileContent();
    }, []);

    const handleFileClick = async (path: string, name: string) => {
        if (selectedFile?.path === path) return;
        try {
            const content = await getZapFileContent(path);
            setSelectedFile(path, content.message);
            setRequest(JSON.parse(content.message), path);
            setActiveTab({ name, path });
        } catch (err) {
            console.error("Failed to load file:", err);
        }
    };

    const handleFolderClick = async (path: string) => {
        const README_PATH = `${path}/README.md`;
        if (selectedFile?.path === README_PATH) return;
        try {
            const content = await getZapFileContent(README_PATH);
            setSelectedFile(README_PATH, content.message);
        } catch (err) {
            console.log("No README found for folder:", path);
        }
    };

    const handleCreateFile = async (folderPath: string) => {
        const fileName = prompt("Enter new file name:");
        if (!fileName) return;
        const path = `${folderPath}/${fileName}.json`;
        try {
            await createZapRequest(fileName, folderPath);
            const content = await getZapFileContent(path);
            triggerWorkspaceUpdate();
            setSelectedFile(path, content.message);
            setRequest(JSON.parse(content.message), path);
            setActiveTab({ name: fileName, path });
        } catch (err) {
            console.error(err);
        }
    };

    const renderFolder = (folder: entriesType) => {
        const [{ isOver }, drop] = useDrop<DragItem>({
            accept: "FILE",
            hover: (item) => {
                if (item.path !== folder.path)
                    setSourceTarget({ source: item, target: folder.path });
            },
            drop: async (item) => {
                if (!item.isDir && item.path !== folder.path) {
                    try {
                        await moveZapRequest(item, folder.path);
                        triggerWorkspaceUpdate();
                    } catch (err) {
                        console.error(err);
                    }
                }
            },
            canDrop: (item) => !item.isDir && item.path !== folder.path,
        });

        return (
            <Collapsible key={folder.path} defaultOpen>
                <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                            onClick={() => handleFolderClick(folder.path)}
                            ref={drop}
                            className={`flex items-center w-full ${isOver ? "bg-muted" : ""}`}
                        >
                            {folder.icon && <folder.icon />}
                            <span className="flex-1 ml-1">{folder.name}</span>

                            <ChevronRight className="ml-auto" />
                        </SidebarMenuButton>
                    </CollapsibleTrigger>

                    <CollapsibleContent>
                        <FolderDropArea
                            folder={folder}
                            setSourceTarget={setSourceTarget}
                            triggerWorkspaceUpdate={triggerWorkspaceUpdate}
                        >
                            {folder.items
                                ?.filter(
                                    (file) =>
                                        !IGNORED_FILES.includes(file.name),
                                )
                                .map((file) => (
                                    <DraggableFile
                                        key={file.path}
                                        file={file}
                                        handleFileClick={handleFileClick}
                                        setSourceTarget={setSourceTarget}
                                        triggerWorkspaceUpdate={
                                            triggerWorkspaceUpdate
                                        }
                                    />
                                ))}
                            <Button
                                onClick={() => handleCreateFile(folder.path)}
                                variant="ghost"
                                className="w-full justify-start"
                            >
                                <Plus className="h-4 w-4 mr-2" /> New File
                            </Button>
                        </FolderDropArea>
                    </CollapsibleContent>
                </SidebarMenuItem>
            </Collapsible>
        );
    };

    return (
        <SidebarGroup>
            <SidebarGroupLabel>{workspace}</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) =>
                    item.isDir ? (
                        renderFolder(item)
                    ) : (
                        <DraggableFile
                            key={item.path}
                            file={item}
                            handleFileClick={handleFileClick}
                            setSourceTarget={setSourceTarget}
                            triggerWorkspaceUpdate={triggerWorkspaceUpdate}
                        />
                    ),
                )}
            </SidebarMenu>
            {/*remove this*/}
            {sourceTarget.source && sourceTarget.target && (
                <div className="mt-2 p-2 text-xs text-destructive bg-destructive/10 rounded">
                    Moving: {sourceTarget.source.name} →{" "}
                    {sourceTarget.target.split("/").pop()}
                </div>
            )}
        </SidebarGroup>
    );
}

export function NavMain({
    items,
    workspace,
}: {
    items: entriesType[];
    workspace: string;
}) {
    return (
        <DndProvider backend={HTML5Backend}>
            <NavMainContent items={items} workspace={workspace} />
        </DndProvider>
    );
}
