import { useEffect, useState, useCallback } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useTabsStore } from "@/store/new/tabs-store";
import { useRef } from "react";
import { ZapQueryParams, ZapRequest } from "@/types/request";
import { Trash2 } from "lucide-react";

export interface QueryParamRow {
    id: string;
    key: string;
    value: string;
    enabled: boolean;
}

export default function QueryParamsTable() {
    const activeTab = useTabsStore().activeTab;
    const updateTabContent = useTabsStore().updateTabContent;

    const [data, setData] = useState<QueryParamRow[]>([]);

    const prevTabPath = useRef<string | undefined>(undefined);
    const prevTabContent = useRef<ZapRequest | undefined>(undefined);
    const prevData = useRef<QueryParamRow[]>([]);

    useEffect(() => {
        if (activeTab?.content && typeof activeTab.content === "string") {
            try {
                const fileConfig = JSON.parse(activeTab.content);
                const req = fileConfig.content as ZapRequest;
                if (!req?.params || !Array.isArray(req.params)) {
                    setData([]);
                    prevTabContent.current = req;
                    prevData.current = [];
                } else {
                    const loaded = req.params.map((h, idx) => ({
                        id: idx.toString(),
                        key: h.key,
                        value: h.value,
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

    const persistParams = useCallback(
        (updatedData: QueryParamRow[]) => {
            if (
                !prevTabPath.current ||
                !prevTabContent.current ||
                !activeTab?.content ||
                typeof activeTab.content !== "string"
            )
                return;
            const activeParams: ZapQueryParams[] = updatedData.map((d) => ({
                key: d.key,
                value: d.value,
                enabled: d.enabled,
            }));
            const updatedReq: ZapRequest = {
                ...prevTabContent.current,
                params: activeParams,
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

    const handleInputChange = useCallback(
        (id: string, field: "key" | "value", value: string) => {
            setData((prev) => {
                const updated = prev.map((row) =>
                    row.id === id ? { ...row, [field]: value } : row,
                );
                prevData.current = updated;
                persistParams(updated); // <-- Save to tab content
                return updated;
            });
        },
        [persistParams],
    );

    const handleCheckboxChange = useCallback(
        (id: string, checked: boolean) => {
            setData((prev) => {
                const updated = prev.map((row) =>
                    row.id === id ? { ...row, enabled: checked } : row,
                );
                prevData.current = updated;
                persistParams(updated);
                return updated;
            });
        },
        [persistParams],
    );

    const handleDeleteRow = useCallback(
        (id: string) => {
            setData((prev) => {
                const updated = prev.filter((row) => row.id !== id);
                prevData.current = updated;
                persistParams(updated);
                return updated;
            });
        },
        [persistParams],
    );

    const addRow = useCallback(() => {
        const newRow: QueryParamRow = {
            id: Date.now().toString(),
            key: "",
            value: "",
            enabled: true,
        };
        setData((prev) => {
            const updated = [newRow, ...prev];
            prevData.current = updated;
            persistParams(updated);
            return updated;
        });
    }, [persistParams]);

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
                persistParams(updated);
                return updated;
            });
        },
        [persistParams],
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
                    Add Param
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
                        No params added
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
                                disabled={!row.enabled}
                                placeholder="Param key"
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
                                placeholder="Param value"
                                className="flex-1 min-w-0"
                                onChange={(e) =>
                                    handleInputChange(
                                        row.id,
                                        "value",
                                        e.target.value,
                                    )
                                }
                            />

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
