import JsonEditor from "@/components/editor/editor";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useZapRequest } from "@/store/request-store";
import { ZapRawBodyTypeLanguage } from "@/types/request";
import { useEffect } from "react";
import { stat } from "@tauri-apps/plugin-fs";

const LANGUAGES = [
    { language: "json", title: "JSON" },
    { language: "xml", title: "XML" },
    { language: "html", title: "HTML" },
    { language: "javascript", title: "JavaScript" },
    { language: "text", title: "Plain Text" },
];

export default function PlaygroundBodyRaw({ path }: { path: string }) {
    const storeLanguage = useZapRequest(
        (state) => state.getRequest(path)?.body?.language ?? "text",
    );

    const setCurrentBody = useZapRequest((state) => state.setCurrentBody);

    const [language, setLanguage] =
        useState<ZapRawBodyTypeLanguage>(storeLanguage);

    useEffect(() => {
        setLanguage(storeLanguage);
    }, [storeLanguage]);

    const bodyContent = useZapRequest((state) => {
        const req = state.getRequest(path);
        const body = req?.body;

        console.log("HERE", body);

        const nested = body?.body?.raw?.[language];

        const flat = body?.raw?.[language];

        return nested ?? flat ?? "";
    });

    const setBody = useZapRequest((state) => state.setBody);

    const handleLanguageSelect = (value: ZapRawBodyTypeLanguage) => {
        setLanguage(value);

        setCurrentBody("raw", path, value);
    };

    const handleValueChange = (value: string) => {
        setBody("raw", path, value, language);
    };

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label className="text-base font-medium">Select Language</Label>
                <Select
                    value={language}
                    onValueChange={(value) =>
                        handleLanguageSelect(value as ZapRawBodyTypeLanguage)
                    }
                >
                    <SelectTrigger className="w-48 h-10 hover:cursor-pointer">
                        <SelectValue placeholder="Select Language" />
                    </SelectTrigger>
                    <SelectContent>
                        {LANGUAGES.map((lang) => (
                            <SelectItem
                                value={lang.language}
                                className="hover:cursor-pointer"
                            >
                                {lang.title}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <JsonEditor
                language={language}
                value={bodyContent || ""}
                onChange={handleValueChange}
            />
        </div>
    );
}
