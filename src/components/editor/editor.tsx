import { useEffect, useRef, useState, useCallback } from "react";
import { basicEditor } from "prism-code-editor/setups";

import "prism-code-editor/prism/languages/json";

import "prism-code-editor/themes/github-dark.css";
import "prism-code-editor/themes/github-light.css";

import { Badge } from "../ui/badge";
import { CircleAlert, CircleCheck, Dot } from "lucide-react";
import { useTheme } from "../theme/theme-provider";

type JsonEditorProps = {
    value?: string;
    onChange?: (value: string) => void;
    height?: string;
    readOnly?: boolean;
};

export default function JsonEditor({
    value = "",
    onChange,
    height = "400px",
    readOnly = false,
}: JsonEditorProps) {
    const editorRef = useRef<any>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isValid, setIsValid] = useState(true);
    const isInitializedRef = useRef(false);

    const { theme } = useTheme();

    const validateJson = useCallback((code: string) => {
        try {
            if (code.trim()) JSON.parse(code);
            setIsValid(true);
        } catch {
            setIsValid(false);
        }
    }, []);

    useEffect(() => {
        if (!containerRef.current || isInitializedRef.current) return;

        theme === "dark" ? "github-dark" : "github-light";

        const editor = basicEditor(containerRef.current, {
            language: "json",
            value: value || "",
            lineNumbers: true,
            readOnly,
            wordWrap: false,
            tabSize: 2,
            insertSpaces: true,
            autoIndent: true,
        });

        editor.setOptions({
            theme: theme === "dark" ? "github-dark" : "github-light",
        });

        editorRef.current = editor;
        isInitializedRef.current = true;

        const handleInput = () => {
            const code = editor.value;
            validateJson(code);
            onChange?.(code);
        };

        editor.on("update", handleInput);
        validateJson(editor.value);

        return () => {
            editor?.remove?.();
            editorRef.current = null;
            isInitializedRef.current = false;
        };
    }, [theme]);

    useEffect(() => {
        if (editorRef.current && isInitializedRef.current) {
            const currentValue = editorRef.current.value;
            if (currentValue !== value) {
                editorRef.current.value = value || "";
                validateJson(value || "");
            }
        }
    }, [value, validateJson]);

    return (
        <div className="w-full">
            <div className="flex justify-end mb-2">
                {isValid ? (
                    <Badge
                        variant="secondary"
                        className="flex items-center gap-1.5 px-2.5 py-1 text-green-600 dark:text-green-400 bg-green-600/10 dark:bg-green-500/10 border-none font-medium"
                    >
                        <CircleCheck className="h-3.5 w-3.5 text-green-500 dark:text-green-400" />
                        Valid
                    </Badge>
                ) : (
                    <Badge
                        variant="secondary"
                        className="flex items-center gap-1.5 px-2.5 py-1 text-red-600 dark:text-red-400 bg-red-600/10 dark:bg-red-500/10 border-none font-medium"
                    >
                        <CircleAlert className="h-3.5 w-3.5 text-red-500 dark:text-red-400" />
                        Invalid
                    </Badge>
                )}
            </div>

            <div className="bg-card rounded-lg  border border-border overflow-hidden">
                <div className="bg-background relative">
                    <div
                        ref={containerRef}
                        className="w-full dark:bg-black light:bg-white"
                        style={{
                            height,
                            fontSize: "16px",
                            fontFamily: "var(--font-mono)",
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
