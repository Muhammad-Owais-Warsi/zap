import { useState, useEffect, useCallback, useRef } from "react";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useTabsStore } from "@/store/tabs-store";
import { ZapBodyType, ZapRequest } from "@/types/request";
import PlaygroundBodyFormData from "./form-data";
import PlaygroundBodyXwwwFormUrlencoded from "./x-www-form-urlencoded";
import PlaygroundBodyRaw from "./raw";
import PlaygroundBodyNone from "./none";

const BODY_TYPES = [
    { title: "None", value: "none" },
    { title: "Form Data", value: "form-data" },
    { title: "x-www-form-urlencoded", value: "x-www-form-urlencoded" },
    { title: "Raw", value: "raw" },
];

export default function PlaygroundMainBodyConfig() {
    const activeTab = useTabsStore().activeTab;
    const updateTabContent = useTabsStore().updateTabContent;

    const [currentBodyType, setCurrentBodyType] = useState<ZapBodyType>("none");
    const prevTabPath = useRef<string | undefined>(undefined);

    useEffect(() => {
        const isNewTab = prevTabPath.current !== activeTab?.path;

        if (!isNewTab) return;

        if (activeTab?.content && typeof activeTab.content === "string") {
            try {
                const fileConfig = JSON.parse(activeTab.content);
                const req = fileConfig.content as ZapRequest;

                if (!req?.body) {
                    setCurrentBodyType("none");
                } else {
                    let detectedType: ZapBodyType = "none";

                    if (req.currentBodyType) {
                        detectedType = req.currentBodyType;
                    } else {
                        if (
                            req.body["form-data"] &&
                            Array.isArray(req.body["form-data"]) &&
                            req.body["form-data"].length > 0
                        ) {
                            detectedType = "form-data";
                        } else if (
                            req.body["x-www-form-urlencoded"] &&
                            Array.isArray(req.body["x-www-form-urlencoded"]) &&
                            req.body["x-www-form-urlencoded"].length > 0
                        ) {
                            detectedType = "x-www-form-urlencoded";
                        } else if (
                            req.body.raw &&
                            typeof req.body.raw === "string" &&
                            req.body.raw.length > 0
                        ) {
                            detectedType = "raw";
                        }
                    }

                    setCurrentBodyType(detectedType);
                }
                prevTabPath.current = activeTab.path;
            } catch {
                setCurrentBodyType("none");
                prevTabPath.current = activeTab?.path;
            }
        } else {
            setCurrentBodyType("none");
            prevTabPath.current = activeTab?.path;
        }
    }, [activeTab?.path]);

    const persistBody = useCallback(
        (bodyType: ZapBodyType) => {
            const currentTab = useTabsStore.getState().activeTab;
            if (!currentTab?.content || typeof currentTab.content !== "string")
                return;

            try {
                const fileConfig = JSON.parse(currentTab.content);
                const req = fileConfig.content as ZapRequest;

                const updatedReq: ZapRequest = {
                    ...req,
                    currentBodyType: bodyType,
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
                console.error("Failed to update body type:", error);
            }
        },
        [updateTabContent],
    );

    const handleBodyTypeChange = useCallback(
        (value: ZapBodyType) => {
            setCurrentBodyType(value);
            persistBody(value);
        },
        [persistBody],
    );

    const renderConfigContent = () => {
        switch (currentBodyType) {
            case "none":
                return <PlaygroundBodyNone />;
            case "form-data":
                return <PlaygroundBodyFormData />;
            case "x-www-form-urlencoded":
                return <PlaygroundBodyXwwwFormUrlencoded />;
            case "raw":
                return <PlaygroundBodyRaw path={prevTabPath.current || ""} />;
            default:
                return null;
        }
    };

    return (
        <div className="w-full">
            <div className="mb-6">
                <h2 className="text-xl font-semibold">Request Body</h2>
                <p className="text-sm text-muted-foreground mt-1">
                    Configure how data should be sent with your API request
                </p>
            </div>

            <div className="flex gap-6 min-h-[400px]">
                <div className="w-64 space-y-4">
                    <div>
                        <Label className="text-base font-medium">
                            Body Type
                        </Label>
                        <Select
                            value={currentBodyType}
                            onValueChange={(value) =>
                                handleBodyTypeChange(value as ZapBodyType)
                            }
                        >
                            <SelectTrigger className="w-full h-12 mt-2 hover:cursor-pointer">
                                <SelectValue placeholder="Select Body Type" />
                            </SelectTrigger>
                            <SelectContent className="hover:cursor-pointer">
                                {BODY_TYPES.map((bodyType) => (
                                    <SelectItem
                                        key={bodyType.value}
                                        value={bodyType.value}
                                        className="hover:cursor-pointer"
                                    >
                                        {bodyType.title}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="w-px bg-border" />

                <div className="flex-1">{renderConfigContent()}</div>
            </div>
        </div>
    );
}
