import { useEffect, useState, useRef } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useTabsStore } from "@/store/new/tabs-store";
import type { ZapRequest, ZapFormUrlEncodedBodyType } from "@/types/request";

export interface XwwwFormUrlencodedRow {
    id: string;
    key: string;
    value: string;
    enabled: boolean;
}

export default function PlaygroundBodyXwwwFormUrlencoded() {
    const activeTab = useTabsStore().activeTab;
    const updateTabContent = useTabsStore().updateTabContent;
    const [data, setData] = useState<XwwwFormUrlencodedRow[]>([]);
    const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

    useEffect(() => {
        if (activeTab?.content && typeof activeTab.content === "string") {
            try {
                const fileConfig = JSON.parse(activeTab.content);
                const req = fileConfig.content as ZapRequest;

                if (
                    !req?.body?.["x-www-form-urlencoded"] ||
                    !Array.isArray(req.body["x-www-form-urlencoded"])
                ) {
                    setData([]);
                } else {
                    const loaded = req.body["x-www-form-urlencoded"].map(
                        (item, idx) => ({
                            id: idx.toString(),
                            key: item.key,
                            value: item.value,
                            enabled: item.enabled ?? true,
                        }),
                    );
                    setData(loaded);
                }
            } catch {
                setData([]);
            }
        } else {
            setData([]);
        }
    }, [activeTab?.path, activeTab?.content]);

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    const persistFormUrlEncoded = (updatedData: XwwwFormUrlencodedRow[]) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
            const currentTab = useTabsStore.getState().activeTab;
            if (!currentTab?.content || typeof currentTab.content !== "string")
                return;

            try {
                const fileConfig = JSON.parse(currentTab.content);
                const req = fileConfig.content as ZapRequest;

                const formUrlEncodedData: ZapFormUrlEncodedBodyType[] =
                    updatedData.map((d) => ({
                        key: d.key,
                        value: d.value,
                        enabled: d.enabled,
                    }));

                const updatedReq: ZapRequest = {
                    ...req,
                    body: {
                        ...req.body,
                        "x-www-form-urlencoded": formUrlEncodedData,
                    },
                    currentBodyType: "x-www-form-urlencoded",
                };

                const updatedFileConfig = {
                    ...fileConfig,
                    content: updatedReq,
                };

                updateTabContent(
                    currentTab.path,
                    JSON.stringify(updatedFileConfig),
                );
            } catch (error) {
                console.error("Failed to update form urlencoded:", error);
            }
        }, 300);
    };

    const handleInputChange = (
        id: string,
        field: "key" | "value",
        value: string,
    ) => {
        setData((prev) => {
            const updated = prev.map((row) =>
                row.id === id ? { ...row, [field]: value } : row,
            );
            persistFormUrlEncoded(updated);
            return updated;
        });
    };

    const handleCheckboxChange = (id: string, checked: boolean) => {
        setData((prev) => {
            const updated = prev.map((row) =>
                row.id === id ? { ...row, enabled: checked } : row,
            );
            persistFormUrlEncoded(updated);
            return updated;
        });
    };

    const handleDeleteRow = (id: string) => {
        setData((prev) => {
            const updated = prev.filter((row) => row.id !== id);
            persistFormUrlEncoded(updated);
            return updated;
        });
    };

    const addRow = () => {
        const newRow: XwwwFormUrlencodedRow = {
            id: Date.now().toString(),
            key: "",
            value: "",
            enabled: true,
        };
        setData((prev) => {
            const updated = [newRow, ...prev];
            persistFormUrlEncoded(updated);
            return updated;
        });
    };

    const handleSelectAll = (checked: boolean) => {
        setData((prev) => {
            const updated = prev.map((row) => ({ ...row, enabled: checked }));
            persistFormUrlEncoded(updated);
            return updated;
        });
    };

    const allEnabled = data.length > 0 && data.every((row) => row.enabled);
    const someEnabled = data.some((row) => row.enabled);

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 mb-2 justify-end">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={addRow}
                    className="flex items-center"
                >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Field
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
                        No fields added
                    </div>
                )}
                {data.map((row) => (
                    <div key={row.id}>
                        <div className="flex flex-col md:flex-row gap-2 items-center p-3 bg-background">
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
                                placeholder="Key"
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
                                placeholder="Value"
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
                                className="ml-2"
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
