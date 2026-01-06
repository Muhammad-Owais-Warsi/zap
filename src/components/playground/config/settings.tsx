import { useEffect, useState, useCallback, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useTabsStore } from "@/store/new/tabs-store";
import type { ZapRequest, ZapNetworkConfig } from "@/types/request";
import { useDebounce } from "@/hooks/use-debounce";

export default function PlaygroundConfigSettings() {
    const activeTab = useTabsStore().activeTab;
    const updateTabContent = useTabsStore().updateTabContent;

    const [networkConfig, setNetworkConfig] = useState<ZapNetworkConfig>([]);

    const prevTabPath = useRef<string | undefined>(undefined);
    const prevTabContent = useRef<ZapRequest | undefined>(undefined);

    useEffect(() => {
        if (activeTab?.content && typeof activeTab.content === "string") {
            try {
                const fileConfig = JSON.parse(activeTab.content);
                const req = fileConfig.content as ZapRequest;
                if (!req?.networkConfig || !Array.isArray(req.networkConfig)) {
                    setNetworkConfig([]);
                    prevTabContent.current = req;
                } else {
                    setNetworkConfig(req.networkConfig);
                    prevTabContent.current = req;
                }
                prevTabPath.current = activeTab.path;
            } catch {
                setNetworkConfig([]);
                prevTabContent.current = undefined;
                prevTabPath.current = activeTab?.path;
            }
        } else {
            setNetworkConfig([]);
            prevTabContent.current = undefined;
            prevTabPath.current = activeTab?.path;
        }
    }, [activeTab]);

    const persistNetworkConfig = useCallback(
        (updatedConfig: ZapNetworkConfig) => {
            if (
                !prevTabPath.current ||
                !prevTabContent.current ||
                !activeTab?.content ||
                typeof activeTab.content !== "string"
            )
                return;

            const updatedReq: ZapRequest = {
                ...prevTabContent.current,
                networkConfig: updatedConfig,
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

    // Debounced version for text/number inputs
    const debouncedPersistNetworkConfig = useDebounce(
        persistNetworkConfig,
        500,
    );

    const updateConfig = useCallback(
        (key: string, value: any, debounce: boolean = false) => {
            setNetworkConfig((prev) => {
                const updated = prev.map((item) =>
                    item.key === key ? { ...item, value } : item,
                );
                if (debounce) {
                    debouncedPersistNetworkConfig(updated);
                } else {
                    persistNetworkConfig(updated);
                }
                return updated;
            });
        },
        [persistNetworkConfig, debouncedPersistNetworkConfig],
    );

    return (
        <div className="flex flex-col gap-10">
            {networkConfig?.map((item) => (
                <div
                    key={item.key}
                    className="flex items-center justify-between"
                >
                    <div className="flex flex-col">
                        <Label className="font-medium">{item.title}</Label>
                        <p className="text-sm text-muted-foreground">
                            {item.description}
                        </p>
                    </div>

                    <div>
                        {item.type === "boolean" && (
                            <Switch
                                checked={item.value}
                                onCheckedChange={(val: boolean) =>
                                    updateConfig(item.key, val)
                                }
                            />
                        )}

                        {(item.type === "string" || item.type === "number") &&
                            !item.options && (
                                <Input
                                    type="text"
                                    value={item.value || ""}
                                    onChange={(e) =>
                                        updateConfig(
                                            item.key,
                                            e.target.value,
                                            true,
                                        )
                                    }
                                    className="h-8 w-[200px]"
                                />
                            )}

                        {item.options && item.type === "string" && (
                            <Select
                                value={item.value}
                                onValueChange={(val) =>
                                    updateConfig(item.key, val)
                                }
                            >
                                <SelectTrigger className="h-8 w-[200px]">
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                    {item.options.map((opt) => (
                                        <SelectItem key={opt} value={opt}>
                                            {opt}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}

                        {item.type === "string[]" && (
                            <Select
                                onValueChange={(val) => {
                                    const currentValue = item.value || [];

                                    const selected = currentValue.includes(val)
                                        ? currentValue.filter(
                                              (v: string) => v !== val,
                                          )
                                        : [...currentValue, val];
                                    updateConfig(item.key, selected);
                                }}
                            >
                                <SelectTrigger className="h-8 w-[200px]">
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                    {item.options?.map((opt) => (
                                        <SelectItem key={opt} value={opt}>
                                            {(item.value || []).includes(opt)
                                                ? `✓ ${opt}`
                                                : opt}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
