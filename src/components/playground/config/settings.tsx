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
import { useZapRequest } from "@/store/request-store";
import { useCwdStore } from "@/store/cwd-store";

export default function PlaygroundConfigSettings() {
    const selectedFile = useCwdStore((state) => state.selectedFile);

    const networkConfig = useZapRequest(
        (state) => state.getRequest(selectedFile?.path)?.networkConfig,
    );

    const setNetworkConfig = useZapRequest((state) => state.setNetworkConfig);

    const updateConfig = (key: string, value: any) => {
        if (!selectedFile) return;
        console.log("hello");
        console.log(key, value);
        setNetworkConfig(key, value, selectedFile?.path);
        console.log("done");
    };

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
                                defaultChecked={item.default}
                                onCheckedChange={(val: boolean) =>
                                    updateConfig(item.key, val)
                                }
                            />
                        )}

                        {(item.type === "string" || item.type === "number") &&
                            !item.options && (
                                <Input
                                    type="text"
                                    value={item.value}
                                    onChange={(e) =>
                                        updateConfig(item.key, e.target.value)
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
                                    const selected = item.value.includes(val)
                                        ? item.value.filter(
                                              (v: string) => v !== val,
                                          )
                                        : [...item.value, val];
                                    updateConfig(item.key, selected);
                                }}
                            >
                                <SelectTrigger className="h-8 w-[200px]">
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                    {item.options?.map((opt) => (
                                        <SelectItem key={opt} value={opt}>
                                            {item.value.includes(opt)
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
