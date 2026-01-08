import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import { useCwdStore } from "@/store/cwd-store";
import { useTabsStore } from "@/store/tabs-store";

export function WorkspaceSwitcher() {
    const [open, setOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);

    const workspace = useCwdStore().workspace;
    const setWorkspace = useCwdStore().setWorkspace;
    const resetTabs = useTabsStore().resetTabs;
    const workspaces = useCwdStore().workspaces;

    const filteredWorkspaces =
        workspaces?.filter((item) => item !== workspace) || [];

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
                e.preventDefault();
                setOpen((prev) => !prev);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    useEffect(() => {
        if (open) {
            setSelectedIndex(0);
        }
    }, [open]);

    const handleSelect = useCallback(
        (index: number) => {
            if (!filteredWorkspaces?.length) return;
            const selected = filteredWorkspaces[index];
            setWorkspace(selected);
            resetTabs();
            setOpen(false);
        },
        [filteredWorkspaces, setWorkspace],
    );

    const handleDialogKey = useCallback(
        (e: React.KeyboardEvent<HTMLDivElement>) => {
            if (!filteredWorkspaces?.length) return;

            if (e.key === "ArrowDown") {
                e.preventDefault();
                setSelectedIndex(
                    (prev) => (prev + 1) % filteredWorkspaces.length,
                );
            } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setSelectedIndex(
                    (prev) =>
                        (prev - 1 + filteredWorkspaces.length) %
                        filteredWorkspaces.length,
                );
            } else if (e.key === "Enter") {
                e.preventDefault();
                handleSelect(selectedIndex);
            } else if (e.key === "Escape") {
                setOpen(false);
            }
        },
        [filteredWorkspaces, selectedIndex, handleSelect],
    );

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild className="hover:cursor-pointer">
                <Button
                    variant="ghost"
                    size="xs"
                    className="text-xs hover:cursor-pointer flex items-center gap-1"
                    onClick={() => setOpen(true)}
                >
                    <span>{workspace}</span>
                </Button>
            </DialogTrigger>

            <DialogContent
                className="sm:max-w-[425px]"
                onKeyDown={handleDialogKey}
            >
                <DialogHeader>
                    <DialogTitle>Switch Workspace</DialogTitle>
                    <DialogDescription>
                        Use ↑ / ↓ to navigate, Enter or click to select.
                    </DialogDescription>
                </DialogHeader>

                <div className="mt-4 space-y-1">
                    {filteredWorkspaces?.length ? (
                        filteredWorkspaces.map((item, idx) => (
                            <div
                                key={item}
                                onClick={() => handleSelect(idx)}
                                onMouseEnter={() => setSelectedIndex(idx)}
                                className={`p-2 rounded cursor-pointer text-sm  ${
                                    idx === selectedIndex
                                        ? "bg-primary text-primary-foreground"
                                        : "hover:bg-muted"
                                }`}
                            >
                                {item}
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-muted-foreground">
                            No workspaces found.
                        </p>
                    )}
                </div>

                <DialogFooter className="mt-4">
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
