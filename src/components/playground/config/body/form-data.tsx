import { useEffect, useState, useRef } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useTabsStore } from "@/store/new/tabs-store";
import type { ZapRequest, ZapFormDataBodyType } from "@/types/request";

export interface FormDataRow {
    id: string;
    key: string;
    value: string;
    type: "text" | "file";
    enabled: boolean;
}

export default function PlaygroundBodyFormData() {
    const activeTab = useTabsStore().activeTab;
    const updateTabContent = useTabsStore().updateTabContent;
    const [data, setData] = useState<FormDataRow[]>([]);
    const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

    useEffect(() => {
        if (activeTab?.content && typeof activeTab.content === "string") {
            try {
                const fileConfig = JSON.parse(activeTab.content);
                const req = fileConfig.content as ZapRequest;

                if (
                    !req?.body?.["form-data"] ||
                    !Array.isArray(req.body["form-data"])
                ) {
                    setData([]);
                } else {
                    const loaded = req.body["form-data"].map((item, idx) => ({
                        id: idx.toString(),
                        key: item.key,
                        value: typeof item.value === "string" ? item.value : "",
                        type: item.type || "text",
                        enabled: item.enabled ?? true,
                    }));
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

    const persistFormData = (updatedData: FormDataRow[]) => {
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

                const formData: ZapFormDataBodyType[] = updatedData.map(
                    (d) => ({
                        key: d.key,
                        value: d.value,
                        type: d.type,
                        enabled: d.enabled,
                    }),
                );

                const updatedReq: ZapRequest = {
                    ...req,
                    body: {
                        ...req.body,
                        "form-data": formData,
                    },
                    currentBodyType: "form-data",
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
                console.error("Failed to update form data:", error);
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
            persistFormData(updated);
            return updated;
        });
    };

    const handleTypeChange = (id: string, type: "text" | "file") => {
        setData((prev) => {
            const updated = prev.map((row) =>
                row.id === id
                    ? { ...row, type, value: type === "file" ? "" : row.value }
                    : row,
            );
            persistFormData(updated);
            return updated;
        });
    };

    const handleCheckboxChange = (id: string, checked: boolean) => {
        setData((prev) => {
            const updated = prev.map((row) =>
                row.id === id ? { ...row, enabled: checked } : row,
            );
            persistFormData(updated);
            return updated;
        });
    };

    const handleDeleteRow = (id: string) => {
        setData((prev) => {
            const updated = prev.filter((row) => row.id !== id);
            persistFormData(updated);
            return updated;
        });
    };

    const addRow = () => {
        const newRow: FormDataRow = {
            id: Date.now().toString(),
            key: "",
            value: "",
            type: "text",
            enabled: true,
        };
        setData((prev) => {
            const updated = [newRow, ...prev];
            persistFormData(updated);
            return updated;
        });
    };

    const handleSelectAll = (checked: boolean) => {
        setData((prev) => {
            const updated = prev.map((row) => ({ ...row, enabled: checked }));
            persistFormData(updated);
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
                            {row.type === "file" ? (
                                <Input
                                    type="file"
                                    disabled={!row.enabled}
                                    className="flex-1 min-w-0"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            const filePath =
                                                (file as any).path ||
                                                file.webkitRelativePath ||
                                                file.name;
                                            handleInputChange(
                                                row.id,
                                                "value",
                                                filePath,
                                            );
                                        }
                                    }}
                                />
                            ) : (
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
                            )}
                            <Select
                                value={row.type}
                                disabled={!row.enabled}
                                onValueChange={(value: "text" | "file") =>
                                    handleTypeChange(row.id, value)
                                }
                            >
                                <SelectTrigger className="w-[100px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="text">Text</SelectItem>
                                    <SelectItem value="file">File</SelectItem>
                                </SelectContent>
                            </Select>
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
