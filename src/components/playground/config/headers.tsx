import { useEffect, useState, useCallback, useRef } from "react";
import { Plus, Info, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTabsStore } from "@/store/new/tabs-store";
import type { ZapRequest, ZapHeaders } from "@/types/request";
import { useDebounce } from "@/hooks/use-debounce";

export interface HeadersRow {
    id: string;
    key: string;
    value: string;
    default: boolean;
    description: string;
    enabled: boolean;
}

export default function PlaygroundConfigHeadersList() {
    const activeTab = useTabsStore().activeTab;
    const updateTabContent = useTabsStore().updateTabContent;

    const [data, setData] = useState<HeadersRow[]>([]);

    const prevTabPath = useRef<string | undefined>(undefined);
    const prevTabContent = useRef<ZapRequest | undefined>(undefined);
    const prevData = useRef<HeadersRow[]>([]);

    useEffect(() => {
        if (activeTab?.content && typeof activeTab.content === "string") {
            try {
                const fileConfig = JSON.parse(activeTab.content);
                const req = fileConfig.content as ZapRequest;
                if (!req?.headers || !Array.isArray(req.headers)) {
                    setData([]);
                    prevTabContent.current = req;
                    prevData.current = [];
                } else {
                    const loaded = req.headers.map((h, idx) => ({
                        id: idx.toString(),
                        key: h.key,
                        value: h.value,
                        default: h.default ?? false,
                        description: h.description ?? "",
                        enabled: h.enabled ?? true,
                    }));
                    setData(loaded);
                    prevTabContent.current = req;
                    prevData.current = loaded;
                }
                prevTabPath.current = activeTab.path;
            } catch {
                setData([]);
                prevTabContent.current = undefined;
                prevData.current = [];
                prevTabPath.current = activeTab?.path;
            }
        } else {
            setData([]);
            prevTabContent.current = undefined;
            prevData.current = [];
            prevTabPath.current = activeTab?.path;
        }
    }, [activeTab]);

    const persistHeaders = useCallback(
        (updatedData: HeadersRow[]) => {
            if (
                !prevTabPath.current ||
                !prevTabContent.current ||
                !activeTab?.content ||
                typeof activeTab.content !== "string"
            )
                return;
            const activeHeaders: ZapHeaders[] = updatedData.map((d) => ({
                key: d.key,
                value: d.value,
                description: d.description,
                default: d.default,
                enabled: d.enabled,
            }));
            const updatedReq: ZapRequest = {
                ...prevTabContent.current,
                headers: activeHeaders,
            };
            try {
                const prevFileConfig = JSON.parse(activeTab.content);
                const updatedFileConfig = {
                    ...prevFileConfig,
                    content: updatedReq,
                };
                updateTabContent(
                    prevTabPath.current,
                    JSON.stringify(updatedFileConfig),
                );
                prevTabContent.current = updatedReq;
            } catch {
                // ignore
            }
        },
        [updateTabContent],
    );

    // Debounced version for text inputs
    const debouncedPersistHeaders = useDebounce(persistHeaders, 500);

    const handleInputChange = useCallback(
        (id: string, field: "key" | "value", value: string) => {
            setData((prev) => {
                const updated = prev.map((row) =>
                    row.id === id ? { ...row, [field]: value } : row,
                );
                prevData.current = updated;
                debouncedPersistHeaders(updated);
                return updated;
            });
        },
        [debouncedPersistHeaders],
    );

    const handleCheckboxChange = useCallback(
        (id: string, checked: boolean) => {
            setData((prev) => {
                const updated = prev.map((row) =>
                    row.id === id ? { ...row, enabled: checked } : row,
                );
                prevData.current = updated;
                persistHeaders(updated);
                return updated;
            });
        },
        [persistHeaders],
    );

    const handleDeleteRow = useCallback(
        (id: string) => {
            setData((prev) => {
                const updated = prev.filter((row) => row.id !== id);
                prevData.current = updated;
                persistHeaders(updated);
                return updated;
            });
        },
        [persistHeaders],
    );

    const addRow = useCallback(() => {
        const newRow: HeadersRow = {
            id: Date.now().toString(),
            key: "",
            value: "",
            default: false,
            description: "",
            enabled: true,
        };
        setData((prev) => {
            const updated = [newRow, ...prev];
            prevData.current = updated;
            persistHeaders(updated);
            return updated;
        });
    }, [persistHeaders]);

    const allEnabled = data.length > 0 && data.every((row) => row.enabled);
    const someEnabled = data.some((row) => row.enabled);

    const handleSelectAll = useCallback(
        (checked: boolean) => {
            setData((prev) => {
                const updated = prev.map((row) => ({
                    ...row,
                    enabled: checked,
                }));
                prevData.current = updated;
                persistHeaders(updated);
                return updated;
            });
        },
        [persistHeaders],
    );

    return (
        <div className="flex flex-col gap-4 ">
            <div className="flex items-center gap-2 mb-2 justify-end">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={addRow}
                    className="flex items-center"
                >
                    <Plus className="h-4 w-4 mr-1" />
                    Add header
                </Button>
                <Checkbox
                    checked={allEnabled}
                    indeterminate={!allEnabled && someEnabled}
                    onCheckedChange={(value) => handleSelectAll(!!value)}
                    className="ml-2"
                />
                <span className="text-sm">Select All</span>
            </div>
            <div className="flex flex-col gap-2">
                {data.length === 0 && (
                    <div className="text-center text-muted-foreground py-4">
                        No headers added
                    </div>
                )}
                {data.map((row) => (
                    <div>
                        <div
                            key={row.id}
                            className="flex flex-col md:flex-row gap-2 items-center  p-3 bg-background"
                        >
                            <Checkbox
                                checked={row.enabled}
                                onCheckedChange={(value) =>
                                    handleCheckboxChange(row.id, !!value)
                                }
                                className="mr-2"
                            />
                            <Input
                                type="text"
                                value={row.key}
                                disabled={row.default}
                                placeholder="Header key"
                                className="flex-1 min-w-0"
                                onChange={(e) =>
                                    handleInputChange(
                                        row.id,
                                        "key",
                                        e.target.value,
                                    )
                                }
                            />
                            <Input
                                type="text"
                                value={row.value}
                                disabled={!row.enabled}
                                placeholder="Header value"
                                className="flex-1 min-w-0"
                                onChange={(e) =>
                                    handleInputChange(
                                        row.id,
                                        "value",
                                        e.target.value,
                                    )
                                }
                            />
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon-sm"
                                        className=""
                                    >
                                        <Info />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    {row.description || "No description"}
                                </TooltipContent>
                            </Tooltip>
                            <Button
                                variant="ghost"
                                size="icon-sm"
                                className=" ml-2  "
                                onClick={() => handleDeleteRow(row.id)}
                            >
                                <Trash2 className="w-4 h-4 text-red-600 hover:text-white" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
