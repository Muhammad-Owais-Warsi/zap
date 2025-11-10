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
import { File } from "lucide-react";
import { useState, useEffect } from "react";
import { useCwdStore } from "@/store/cwd-store";
import { createZapRequest } from "@/file-system/fs-operation";
import {
    SelectTrigger,
    Select,
    SelectContent,
    SelectValue,
    SelectGroup,
    SelectItem,
} from "../ui/select";

export default function CreateRequest() {
    const workspace = useCwdStore((state) => state.name);
    const triggerWorkspaceUpdate = useCwdStore(
        (state) => state.triggerWorkspaceUpdate,
    );
    const [fileName, setFileName] = useState("");
    const [open, setOpen] = useState(false);

    const handleCreateFile = async () => {
        if (!fileName.trim()) return;
        if (workspace) await createZapRequest(fileName.trim(), workspace);
        setFileName("");
        triggerWorkspaceUpdate();
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (
                (e.ctrlKey || e.metaKey) &&
                e.shiftKey &&
                e.key.toLowerCase() === "r"
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
                            <File />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>New Request</TooltipContent>
                </Tooltip>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create new Request</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-1">
                    <Label htmlFor="name" className="text-sm font-medium">
                        Name
                    </Label>
                    <Input
                        id="name"
                        name="name"
                        placeholder="Enter request name"
                        value={fileName}
                        onChange={(e) => setFileName(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                handleCreateFile();
                            }
                        }}
                        autoFocus
                    />
                </div>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button type="submit" onClick={handleCreateFile}>
                        Create
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
