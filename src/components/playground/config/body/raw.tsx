import JsonEditor from "@/components/editor/editor";
import { useTabsStore } from "@/store/tabs-store";
import { useEffect, useState, useRef } from "react";
import { ZapRequest } from "@/types/request";

export default function PlaygroundBodyRaw({ path }: { path: string }) {
    const activeTab = useTabsStore().activeTab;
    const updateTabContent = useTabsStore().updateTabContent;
    const [bodyContent, setBodyContent] = useState<string>("");
    const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

    useEffect(() => {
        if (activeTab?.content && typeof activeTab.content === "string") {
            try {
                const fileConfig = JSON.parse(activeTab.content);
                const req = fileConfig.content as ZapRequest;
                let rawBody = req?.body?.raw ?? "";

                if (typeof rawBody === "object" && rawBody !== null) {
                    const values = Object.values(
                        rawBody as Record<string, string>,
                    );
                    rawBody = values.find((v) => v && v.length > 0) || "";
                }

                setBodyContent(rawBody);
            } catch {
                setBodyContent("");
            }
        } else {
            setBodyContent("");
        }
    }, [activeTab?.path, activeTab?.content]);

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    const handleValueChange = (value: string) => {
        setBodyContent(value);

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

                const updatedReq: ZapRequest = {
                    ...req,
                    body: {
                        ...req.body,
                        raw: value,
                    },
                    currentBodyType: "raw",
                };

                const updatedFileConfig = {
                    ...fileConfig,
                    content: updatedReq,
                };

                updateTabContent(path, JSON.stringify(updatedFileConfig));
            } catch (error) {
                console.error("Failed to update raw body:", error);
            }
        }, 300);
    };

    return (
        <div className="space-y-4">
            <JsonEditor
                key={path}
                language="json"
                value={bodyContent}
                onChange={handleValueChange}
            />
        </div>
    );
}
