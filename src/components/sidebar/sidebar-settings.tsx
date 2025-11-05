import { useState, useEffect } from "react";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogClose,
    DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Settings } from "lucide-react";

const SETTINGS_SECTIONS = [
    { name: "General", description: "Basic application preferences." },
    { name: "Appearance", description: "Change theme and layout options." },
    {
        name: "Workspaces",
        description: "Manage and switch between workspaces.",
    },
    { name: "Shortcuts", description: "Customize keyboard shortcuts." },
    { name: "Advanced", description: "Experimental or developer options." },
];

export default function SidebarSettings() {
    const [open, setOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (
                (e.ctrlKey || e.metaKey) &&
                e.shiftKey &&
                e.key.toLowerCase() === "s"
            ) {
                e.preventDefault();
                setOpen((prev) => !prev);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setSelectedIndex((prev) => (prev + 1) % SETTINGS_SECTIONS.length);
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setSelectedIndex((prev) =>
                prev === 0 ? SETTINGS_SECTIONS.length - 1 : prev - 1,
            );
        } else if (e.key === "Escape") {
            setOpen(false);
        }
    };

    useEffect(() => {
        if (open) setSelectedIndex(0);
    }, [open]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Settings />
                </Button>
            </DialogTrigger>

            <DialogContent
                className="sm:max-w-[720px] h-[80vh] flex flex-row p-0 overflow-hidden"
                onKeyDown={handleKeyDown}
            >
                <div className="w-1/3 border-r bg-muted/40 p-2 space-y-1 overflow-y-auto">
                    {SETTINGS_SECTIONS.map((item, idx) => (
                        <div
                            key={item.name}
                            onClick={() => setSelectedIndex(idx)}
                            onMouseEnter={() => setSelectedIndex(idx)}
                            className={`p-2 rounded-md cursor-pointer text-sm transition-colors ${
                                idx === selectedIndex
                                    ? "bg-primary text-primary-foreground"
                                    : "hover:bg-muted"
                            }`}
                        >
                            {item.name}
                        </div>
                    ))}
                </div>

                {/* Make this column a vertical flex container so the footer can be pushed to the bottom */}
                <div className="flex-1 p-6 flex flex-col">
                    <DialogHeader>
                        <DialogTitle>
                            {SETTINGS_SECTIONS[selectedIndex].name}
                        </DialogTitle>
                        <DialogDescription>
                            {SETTINGS_SECTIONS[selectedIndex].description}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="mt-4 text-sm text-muted-foreground space-y-3">
                        {selectedIndex === 0 && (
                            <div>
                                <h4 className="font-medium mb-2">
                                    General Settings
                                </h4>
                                <p>
                                    Change app language, autosave interval, and
                                    sync behavior.
                                </p>
                            </div>
                        )}

                        {selectedIndex === 1 && (
                            <div>
                                <h4 className="font-medium mb-2">Appearance</h4>
                                <p>
                                    Switch between light, dark, or system
                                    themes.
                                </p>
                            </div>
                        )}

                        {selectedIndex === 2 && (
                            <div>
                                <h4 className="font-medium mb-2">Workspaces</h4>
                                <p>
                                    Manage and switch between your active
                                    projects.
                                </p>
                            </div>
                        )}

                        {selectedIndex === 3 && (
                            <div>
                                <h4 className="font-medium mb-2">Shortcuts</h4>
                                <p>
                                    Customize keyboard shortcuts for faster
                                    workflows.
                                </p>
                            </div>
                        )}

                        {selectedIndex === 4 && (
                            <div>
                                <h4 className="font-medium mb-2">
                                    Advanced Settings
                                </h4>
                                <p>
                                    Enable experimental features or developer
                                    tools.
                                </p>
                            </div>
                        )}
                    </div>

                    <DialogFooter className="mt-auto flex justify-end  bg-background pt-4">
                        <DialogClose asChild>
                            <Button variant="outline" className="sm:w-auto">
                                Close
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
}
