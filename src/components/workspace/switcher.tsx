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
import { useTabsStore } from "@/store/tabs-store";
import { useCwdStore } from "@/store/cwd-store";
import { Book } from "lucide-react";

export function WorkspaceSwitcher() {
    const [open, setOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);

    const resetTabsStore = useTabsStore((state) => state.resetTabStore);
    const name = useCwdStore((state) => state.name);
    const updateName = useCwdStore((state) => state.updateName);
    const workspaces = useCwdStore((state) => state.workspaces);

    const filteredWorkspaces =
        workspaces?.filter((item) => item !== name) || [];

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
            updateName(selected);
            resetTabsStore();
            setOpen(false);
        },
        [filteredWorkspaces, updateName, resetTabsStore],
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
                <Button className="w-full" variant="outline">
                    <Book />
                    Switch workspace
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
