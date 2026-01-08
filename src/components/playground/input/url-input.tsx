import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";
import {
    ContextMenu,
    ContextMenuTrigger,
    ContextMenuContent,
    ContextMenuItem,
} from "@/components/ui/context-menu";
// import EnvironmentModal from "@/components/environment/main";
import { Copy, Pen } from "lucide-react";
import { useTheme } from "@/components/theme/theme-provider";
import { useTabsStore } from "@/store/new/tabs-store";
import type { ZapRequest } from "@/types/request";

export default function PlaygroundUrlInput() {
    const activeTab = useTabsStore().activeTab;
    const updateTabContent = useTabsStore().updateTabContent;
    const updateIsDirty = useTabsStore().updateIsDirty;

    const { theme } = useTheme();

    const [localUrl, setLocalUrl] = useState("");
    const [isEnvironmentModalOpen, setIsEnvironmentModalOpen] = useState(false);
    const [selectedText, setSelectedText] = useState("");
    const [selectionStart, setSelectionStart] = useState(0);
    const [selectionEnd, setSelectionEnd] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);

    const prevTabPath = useRef<string | undefined>(undefined);
    const prevTabContent = useRef<ZapRequest | undefined>(undefined);

    useEffect(() => {
        if (
            prevTabPath.current &&
            prevTabContent.current &&
            localUrl !== prevTabContent.current.url
        ) {
            const updatedRequest: ZapRequest = {
                ...prevTabContent.current,
                url: localUrl,
            };
            updateTabContent(
                prevTabPath.current,
                JSON.stringify(updatedRequest),
            );
        }

        if (activeTab?.content && typeof activeTab.content === "string") {
            try {
                const tabContent = JSON.parse(activeTab.content) as ZapRequest;
                setLocalUrl(tabContent.url || "");
                prevTabContent.current = tabContent;
                prevTabPath.current = activeTab.path;
            } catch {
                setLocalUrl("");
                prevTabContent.current = undefined;
                prevTabPath.current = activeTab?.path;
            }
        } else {
            setLocalUrl("");
            prevTabContent.current = undefined;
            prevTabPath.current = activeTab?.path;
        }
    }, [activeTab, updateTabContent]);

    function handleUrlChange(value: string) {
        setLocalUrl(value);
        if (activeTab) updateIsDirty(activeTab?.path, true);
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
                            className={`
                                relative bg-transparent
                                ${theme === "dark" ? "caret-white text-transparent" : "caret-black"}
                            `}
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

            {/*<EnvironmentModal
                open={isEnvironmentModalOpen}
                onOpenChange={setIsEnvironmentModalOpen}
                defaultValue={selectedText}
                onSave={handleVariableSave}
                rootDir={activeTab?.path || ""}
            />*/}
        </div>
    );
}
