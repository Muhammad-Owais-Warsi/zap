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
import { useVariableStore } from "@/store/variable-store";
import { useCwdStore } from "@/store/cwd-store";

export default function EnvironmentSwitcher() {
    const [open, setOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);

    const currentEnv = useVariableStore((state) => state.current);
    const setCurrent = useVariableStore((state) => state.setCurrent);
    const workspaceConfig = useCwdStore((state) => state.workspaceConfig);

    const environments = workspaceConfig?.environments || {};
    const environmentList = Object.keys(environments);

    useEffect(() => {
        if (open) {
            const currentIndex = environmentList.findIndex(
                (env) => env === currentEnv,
            );
            setSelectedIndex(currentIndex >= 0 ? currentIndex : 0);
        }
    }, [open, currentEnv, environmentList]);

    const handleSelect = useCallback(
        (index: number) => {
            if (!environmentList?.length) return;
            const selected = environmentList[index];
            setCurrent(selected);
            setOpen(false);
        },
        [environmentList, setCurrent],
    );

    const handleDialogKey = useCallback(
        (e: React.KeyboardEvent<HTMLDivElement>) => {
            if (!environmentList?.length) return;

            if (e.key === "ArrowDown") {
                e.preventDefault();
                setSelectedIndex((prev) => (prev + 1) % environmentList.length);
            } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setSelectedIndex(
                    (prev) =>
                        (prev - 1 + environmentList.length) %
                        environmentList.length,
                );
            } else if (e.key === "Enter") {
                e.preventDefault();
                handleSelect(selectedIndex);
            } else if (e.key === "Escape") {
                setOpen(false);
            }
        },
        [environmentList, selectedIndex, handleSelect],
    );

    if (!workspaceConfig || environmentList.length === 0) {
        return (
            <Button
                variant="ghost"
                size="xs"
                className="text-xs cursor-default opacity-50"
                disabled
            >
                No environments
            </Button>
        );
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild className="hover:cursor-pointer">
                <Button
                    variant="ghost"
                    size="xs"
                    className="text-xs hover:cursor-pointer flex items-center gap-1"
                    onClick={() => setOpen(true)}
                >
                    <span>{currentEnv}</span>
                </Button>
            </DialogTrigger>

            <DialogContent
                className="sm:max-w-[425px]"
                onKeyDown={handleDialogKey}
            >
                <DialogHeader>
                    <DialogTitle>Switch Environment</DialogTitle>
                    <DialogDescription>
                        Use ↑ / ↓ to navigate, Enter or click to select.
                    </DialogDescription>
                </DialogHeader>

                <div className="mt-4 space-y-1">
                    {environmentList?.length ? (
                        environmentList.map((envName, idx) => {
                            const isCurrent = envName === currentEnv;

                            return (
                                <div
                                    key={envName}
                                    onClick={() => handleSelect(idx)}
                                    onMouseEnter={() => setSelectedIndex(idx)}
                                    className={`p-2 rounded cursor-pointer text-sm ${
                                        idx === selectedIndex
                                            ? "bg-primary text-primary-foreground"
                                            : "hover:bg-muted"
                                    }`}
                                >
                                    <div className="flex justify-between items-center">
                                        <span>{envName}</span>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <p className="text-sm text-muted-foreground">
                            No environments found.
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
