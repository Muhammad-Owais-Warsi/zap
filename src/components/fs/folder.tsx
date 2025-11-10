import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from "../ui/dialog";
import {
    Tooltip,
    TooltipTrigger,
    TooltipContent,
    TooltipProvider,
} from "../ui/tooltip";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Folder } from "lucide-react";
import { useState, useEffect } from "react";
import { useCwdStore } from "@/store/cwd-store";
import { createZapFolder } from "@/file-system/fs-operation";

export default function CreateFolder() {
    const workspace = useCwdStore((state) => state.name);
    const triggerWorkspaceUpdate = useCwdStore(
        (state) => state.triggerWorkspaceUpdate,
    );
    const [folderName, setFolderName] = useState("");
    const [open, setOpen] = useState(false);

    const handleCreateFolder = async () => {
        if (!folderName.trim()) return;
        if (workspace) await createZapFolder(folderName.trim(), workspace);
        setFolderName("");
        triggerWorkspaceUpdate();
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (
                (e.ctrlKey || e.metaKey) &&
                e.shiftKey &&
                e.key.toLowerCase() === "f"
            ) {
                e.preventDefault();
                setOpen((prev) => !prev);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger>
                <Tooltip>
                    <TooltipTrigger>
                        <Button
                            variant="ghost"
                            size="icon-sm"
                            className="flex items-center gap-2 hover:cursor-pointer"
                        >
                            <Folder />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>New Folder</TooltipContent>
                </Tooltip>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create new folder</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-1">
                    <Label htmlFor="name" className="text-sm font-medium">
                        Name
                    </Label>
                    <Input
                        id="name"
                        name="name"
                        placeholder="Enter folder name"
                        value={folderName}
                        onChange={(e) => setFolderName(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                handleCreateFolder();
                            }
                        }}
                        autoFocus
                    />
                </div>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button type="submit" onClick={handleCreateFolder}>
                        Create
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
