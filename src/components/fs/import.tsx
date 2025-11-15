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
import parseCurl from "@/lib/parse-curl";
import { writeZapFile } from "@/file-system/fs-operation";
import { useTabsStore } from "@/store/tabs-store";
import { useCwdStore } from "@/store/cwd-store";
import { useZapRequest } from "@/store/request-store";

export default function ImportRequest({ workspace }: { workspace: string }) {
    const [curl, setCurl] = useState("");
    const [open, setOpen] = useState(false);

    const setWorkspaceConfig = useCwdStore((state) => state.setWorkspaceConfig);
    const workspaceConfig = useCwdStore((state) => state.workspaceConfig);
    const setActiveTab = useTabsStore((state) => state.setActiveTab);
    const setSelectedFile = useCwdStore((state) => state.setSelectedFile);
    const triggerWorkspaceUpdate = useCwdStore(
        (state) => state.triggerWorkspaceUpdate,
    );
    const setRequest = useZapRequest((state) => state.setRequest);

    const handleImport = async () => {
        if (!curl.trim()) return;
        const name = `NEW_REQUEST_${Date.now()}.json`;
        const path = `${workspace}/${name}`;
        const content = parseCurl(curl, name, workspace);
        await writeZapFile(path, content.parsedRequest);
        triggerWorkspaceUpdate();
        setRequest(content.parsedRequest, path);
        setSelectedFile(path, JSON.stringify(content.parsedRequest));
        setActiveTab({
            name,
            path: path,
        });

        if (content.cookies.length > 0) {
            const parsedConfig =
                typeof workspaceConfig === "string"
                    ? JSON.parse(workspaceConfig)
                    : workspaceConfig;

            parsedConfig.cookieJar = [
                ...parsedConfig.cookieJar,
                ...content.cookies,
            ];

            const result = await writeZapFile(
                `${workspace}/workspace_config.json`,
                JSON.stringify(parsedConfig),
            );

            if (result.type === "error") return;

            setWorkspaceConfig(parsedConfig);
        }
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
