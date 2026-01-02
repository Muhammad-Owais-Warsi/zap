import React, { useState, useCallback } from "react";
import { ChevronRight, Plus, Folder } from "lucide-react";
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
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from "../ui/context-menu";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import MethodBadge from "../theme/method-badge";

import { type entriesType } from "@/hooks/useWorkspace";
import { IGNORED_FILES } from "@/lib/ignored-files";
import ignoreExt from "@/lib/ignore-extension";
import {
    createZapRequest,
    moveZapRequest,
    removeZapFileOrFolder,
    renameZapFolder,
    renameZapRequest,
} from "@/file-system/fs-operation";
import { ZapHttpMethods } from "@/types/request";
import { useTabsStore } from "@/store/new/tabs-store";
import { FileSystemOperations } from "@/lib/fs/fs";
import { useFileSystemStore } from "@/store/new/file-system";

type DragItem = { path: string; isDir: boolean; name: string };

const DraggableFile = ({
    file,
    onFileClick,
}: {
    file: entriesType;
    onFileClick: (path: string, name: string, method?: ZapHttpMethods) => void;
}) => {
    const [isRenaming, setIsRenaming] = useState(false);
    const [newName, setNewName] = useState(file.name.split(".")[0]);

    const activeFile = useFileSystemStore().activeFile;

    const [{ isDragging }, drag] = useDrag({
        type: "FILE",
        item: { path: file.path, isDir: false, name: file.name },
        canDrag: !isRenaming,
        collect: (monitor) => ({ isDragging: monitor.isDragging() }),
    });

    const handleRename = async () => {
        if (!newName.trim() || newName === file.name.split(".")[0]) {
            setIsRenaming(false);
            return;
        }
        try {
            const oldPath = file.path;
            await renameZapRequest(oldPath, newName);
            FileSystemOperations.renameFileOrFolderAndHandleTabPath(
                oldPath,
                newName,
                false,
            );
            setIsRenaming(false);
        } catch (err) {
            console.error("Rename failed:", err);
        }
    };

    const handleDelete = async () => {
        await removeZapFileOrFolder(file.path);
        FileSystemOperations.deleteFileAndCloseTab(file.path);
    };

    return (
        <SidebarMenuItem
            ref={drag}
            className={isDragging ? "opacity-50" : "opacity-100"}
        >
            {isRenaming ? (
                <div className="px-2 py-1">
                    <Input
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        onBlur={handleRename}
                        onKeyDown={(e) => e.key === "Enter" && handleRename()}
                        autoFocus
                        className="h-6 text-xs"
                    />
                </div>
            ) : (
                <ContextMenu>
                    <ContextMenuTrigger>
                        <SidebarMenuButton
                            isActive={activeFile === file.path}
                            onClick={() =>
                                onFileClick(file.path, file.name, file.method)
                            }
                            onDoubleClick={() => setIsRenaming(true)}
                            className="group"
                        >
                            <span className="flex-1 truncate">
                                {ignoreExt(file.name)}
                            </span>
                            {file.method && (
                                <MethodBadge method={file.method} />
                            )}
                        </SidebarMenuButton>
                    </ContextMenuTrigger>
                    <ContextMenuContent>
                        <ContextMenuItem onClick={() => setIsRenaming(true)}>
                            Rename
                        </ContextMenuItem>
                        <ContextMenuItem
                            variant="destructive"
                            onClick={handleDelete}
                        >
                            Delete
                        </ContextMenuItem>
                    </ContextMenuContent>
                </ContextMenu>
            )}
        </SidebarMenuItem>
    );
};

const FolderItem = ({
    folder,
    onFileClick,
    onFolderClick,
}: {
    folder: entriesType;
    onFileClick: (path: string, name: string) => void;
    onFolderClick: (path: string) => void;
}) => {
    const [isRenaming, setIsRenaming] = useState(false);
    const [newName, setNewName] = useState(folder.name.split("-[")[0]);

    const [{ isOver }, drop] = useDrop({
        accept: "FILE",
        canDrop: (item: DragItem) =>
            !item.isDir && !item.path.startsWith(folder.path),
        drop: async (item: DragItem) => {
            await moveZapRequest(item, folder.path);
            FileSystemOperations.moveFileAndUpdateTab(item.path, folder.path);
        },
        collect: (monitor) => ({ isOver: monitor.isOver({ shallow: true }) }),
    });

    const handleRename = async () => {
        if (!newName.trim() || newName === folder.name.split("-[")[0]) {
            setIsRenaming(false);
            return;
        }
        try {
            const id = folder.path.match(/\[(.*?)\]/)?.[1] || "";
            const oldPath = folder.path;
            const newFolderName = `${newName}-[${id}]`;
            await renameZapFolder(oldPath, newFolderName);
            FileSystemOperations.renameFileOrFolderAndHandleTabPath(
                oldPath,
                newFolderName,
                true,
            );

            setIsRenaming(false);
        } catch (err) {
            console.error(err);
        }
    };

    const handleCreateFile = async (e: React.MouseEvent) => {
        e.stopPropagation();
        const fileName = prompt("Enter new file name:");
        if (!fileName) return;
        console.log(folder.path);
        await createZapRequest(fileName, folder.path);
        FileSystemOperations.createFileAndOpenTab(folder.path, fileName.trim());
    };

    const handleDelete = async () => {
        await removeZapFileOrFolder(folder.path);
        FileSystemOperations.deleteFolderAndCloseTab(folder.path);
    };

    return (
        <Collapsible className="group/collapsible" defaultOpen>
            <SidebarMenuItem>
                <ContextMenu>
                    <ContextMenuTrigger>
                        <CollapsibleTrigger asChild>
                            <SidebarMenuButton
                                ref={drop}
                                className={isOver ? "bg-accent" : ""}
                                onClick={() => onFolderClick(folder.path)}
                                onDoubleClick={() => setIsRenaming(true)}
                            >
                                <Folder className="h-4 w-4 mr-2" />
                                {isRenaming ? (
                                    <Input
                                        value={newName}
                                        autoFocus
                                        onChange={(e) =>
                                            setNewName(e.target.value)
                                        }
                                        onBlur={handleRename}
                                        onKeyDown={(e) =>
                                            e.key === "Enter" && handleRename()
                                        }
                                        className="h-6 text-xs focus:ring-2 focus:ring-blue-500"
                                    />
                                ) : (
                                    <span className="flex-1">
                                        {folder.name.split("-[")[0]}
                                    </span>
                                )}
                                <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                            </SidebarMenuButton>
                        </CollapsibleTrigger>
                    </ContextMenuTrigger>
                    <ContextMenuContent>
                        <ContextMenuItem onClick={() => setIsRenaming(true)}>
                            Rename
                        </ContextMenuItem>
                        <ContextMenuItem
                            variant="destructive"
                            onClick={handleDelete}
                        >
                            Delete
                        </ContextMenuItem>
                    </ContextMenuContent>
                </ContextMenu>
            </SidebarMenuItem>

            <CollapsibleContent>
                <SidebarMenuSub className="ml-4 border-l border-border/50">
                    {folder.items
                        ?.filter((f) => !IGNORED_FILES.includes(f.name))
                        .map((file) => (
                            <DraggableFile
                                key={file.path}
                                file={file}
                                onFileClick={onFileClick}
                            />
                        ))}
                    <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start h-8 text-xs text-muted-foreground hover:text-foreground"
                        onClick={handleCreateFile}
                    >
                        <Plus className="h-3 w-3 mr-2" /> New File
                    </Button>
                </SidebarMenuSub>
            </CollapsibleContent>
        </Collapsible>
    );
};

function NavMainContent({
    items,
    workspace,
}: {
    items: entriesType[];
    workspace: string;
}) {
    const setActiveFile = useFileSystemStore().setActiveFile;

    const setActiveTab = useTabsStore().setActiveTab;

    const handleFileClick = useCallback(
        async (path: string, name: string, method?: ZapHttpMethods) => {
            await FileSystemOperations.selectFileAndHandleTab(
                path,
                name,
                method,
            );
        },
        [setActiveFile, setActiveTab],
    );

    const handleFolderClick = useCallback(
        async (path: string) => {
            const readme = `${path}/README.md`;
            await FileSystemOperations.selectFolderAndHandleTab(readme);
        },
        [setActiveFile, setActiveTab],
    );

    const [{ isOverRoot }, dropRoot] = useDrop({
        accept: "FILE",
        canDrop: (item: DragItem) => !item.isDir,
        drop: async (item: DragItem) => {
            await moveZapRequest(item, workspace);
            FileSystemOperations.moveFileAndUpdateTab(item.path, workspace);
        },
        collect: (monitor) => ({
            isOverRoot: monitor.isOver({ shallow: true }),
        }),
    });

    return (
        <SidebarGroup>
            <SidebarGroupLabel>{workspace}</SidebarGroupLabel>
            <SidebarMenu
                ref={dropRoot}
                className={isOverRoot ? "bg-accent" : ""}
            >
                {items
                    .filter((item) => !IGNORED_FILES.includes(item.name))
                    .map((item) =>
                        item.is_dir ? (
                            <FolderItem
                                key={item.path}
                                folder={item}
                                onFileClick={handleFileClick}
                                onFolderClick={handleFolderClick}
                            />
                        ) : (
                            <DraggableFile
                                key={item.path}
                                file={item}
                                onFileClick={handleFileClick}
                            />
                        ),
                    )}
            </SidebarMenu>
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
    console.log("under", items);
    return (
        <DndProvider backend={HTML5Backend}>
            <NavMainContent items={items} workspace={workspace} />
        </DndProvider>
    );
}
