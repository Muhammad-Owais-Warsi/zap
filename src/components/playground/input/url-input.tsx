import { Input } from "@/components/ui/input";
import { useZapRequest } from "@/store/request-store";
import { useCwdStore } from "@/store/cwd-store";
import { useEffect, useRef, useState } from "react";
import {
    ContextMenu,
    ContextMenuTrigger,
    ContextMenuContent,
    ContextMenuItem,
} from "@/components/ui/context-menu";
import EnvironmentModal from "@/components/environment/main";
import { Copy, Pen } from "lucide-react";

export default function PlaygroundUrlInput() {
    const selectedFile = useCwdStore((state) => state.selectedFile);
    const getRequest = useZapRequest((state) => state.getRequest);
    const setUrl = useZapRequest((state) => state.setUrl);

    const [localUrl, setLocalUrl] = useState("");
    const [isEnvironmentModalOpen, setIsEnvironmentModalOpen] = useState(false);
    const [selectedText, setSelectedText] = useState("");
    const [selectionStart, setSelectionStart] = useState(0);
    const [selectionEnd, setSelectionEnd] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (selectedFile?.path) {
            const request = getRequest(selectedFile.path);
            setLocalUrl(request?.url || "");
        } else {
            setLocalUrl("");
        }
    }, [selectedFile, getRequest]);

    function handleUrlChange(value: string) {
        setLocalUrl(value);
        if (selectedFile?.path) {
            setUrl(value, selectedFile.path);
        }
    }

    function handleContextMenu() {
        const input = inputRef.current;
        if (!input) return;

        const start = input.selectionStart || 0;
        const end = input.selectionEnd || 0;
        const selected = input.value.substring(start, end).trim();

        if (selected) {
            setSelectedText(selected);
            setSelectionStart(start);
            setSelectionEnd(end);
        } else {
            setSelectedText("");
        }
    }

    function handleSetAsVariable() {
        if (selectedText) {
            setIsEnvironmentModalOpen(true);
        } else {
            alert("Please select a part of the URL first.");
        }
    }

    function handleVariableSave(variableName: string) {
        if (selectedText && variableName) {
            const newUrl =
                localUrl.substring(0, selectionStart) +
                `{{${variableName}}}` +
                localUrl.substring(selectionEnd);

            handleUrlChange(newUrl);

            setSelectedText("");
            setSelectionStart(0);
            setSelectionEnd(0);
        }
    }

    const highlightUrl = (val: string) => {
        const escaped = val
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
        return escaped.replace(
            /{{(.*?)}}/g,
            `<span class='bg-primary text-black rounded-sm px-0.5'>{{\$1}}</span>`,
        );
    };

    return (
        <div className="w-full min-w-0 relative">
            <ContextMenu onOpenChange={handleContextMenu}>
                <ContextMenuTrigger>
                    <div className="relative w-full">
                        <div
                            className="absolute inset-0 pointer-events-none whitespace-pre-wrap break-all px-3 py-2 text-sm text-white"
                            dangerouslySetInnerHTML={{
                                __html: highlightUrl(localUrl),
                            }}
                        />

                        <Input
                            ref={inputRef}
                            value={localUrl}
                            className="relative bg-transparent text-transparent dark: caret-white light:caret-dark"
                            placeholder="Enter request URL..."
                            onChange={(e) => handleUrlChange(e.target.value)}
                        />
                    </div>
                </ContextMenuTrigger>

                <ContextMenuContent>
                    <ContextMenuItem
                        onClick={handleSetAsVariable}
                        className="flex items-center gap-2 cursor-pointer"
                    >
                        <Pen className="h-4 w-4" />
                        <span>Set as Variable</span>
                    </ContextMenuItem>

                    <ContextMenuItem
                        onClick={() => navigator.clipboard.writeText(localUrl)}
                        className="flex items-center gap-2 cursor-pointer"
                    >
                        <Copy className="h-4 w-4" />
                        <span>Copy</span>
                    </ContextMenuItem>
                </ContextMenuContent>
            </ContextMenu>

            <EnvironmentModal
                open={isEnvironmentModalOpen}
                onOpenChange={setIsEnvironmentModalOpen}
                defaultValue={selectedText}
                onSave={handleVariableSave}
                rootDir={selectedFile?.path!}
            />
        </div>
    );
}
