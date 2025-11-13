import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from "../ui/dialog";
import { Tooltip, TooltipTrigger, TooltipContent } from "../ui/tooltip";
import { Button } from "../ui/button";
import { ImportIcon } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { useState } from "react";
import { useEffect } from "react";

export default function ImportRequest() {
    const [curl, setCurl] = useState("");
    const [open, setOpen] = useState(false);

    const handleImport = () => {
        if (!curl.trim()) return;
        console.log("Importing cURL:", curl);
        // 👉 You can parse or send this to backend / store here
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "i") {
                e.preventDefault();
                setOpen((prev) => !prev);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <DialogTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon-sm"
                            className="flex items-center gap-2 hover:cursor-pointer"
                        >
                            <ImportIcon />
                        </Button>
                    </DialogTrigger>
                </TooltipTrigger>
                <TooltipContent>Import Request</TooltipContent>
            </Tooltip>

            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Import Request</DialogTitle>
                    <DialogDescription>
                        Paste cURL command to import request
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-3 py-3">
                    <Textarea
                        placeholder="Paste your cURL command here..."
                        value={curl}
                        onChange={(e) => setCurl(e.target.value)}
                        className="min-h-[150px]"
                    />
                </div>

                <DialogFooter>
                    <Button onClick={handleImport}>Import</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
