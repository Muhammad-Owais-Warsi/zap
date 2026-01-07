import { useEffect, useRef, useState, useCallback } from "react";
import { basicEditor } from "prism-code-editor/setups";

import "prism-code-editor/prism/languages/json";

import "prism-code-editor/themes/github-dark.css";
import "prism-code-editor/themes/github-light.css";

import { Badge } from "../ui/badge";
import { CircleAlert, CircleCheck } from "lucide-react";
import { useTheme } from "../theme/theme-provider";

type JsonEditorProps = {
    value: string | null;
    onChange?: (value: string) => void;
    height?: string;
    // readOnly?: boolean;
    language: string;
};

export default function JsonEditor({
    value,
    onChange,
    height = "400px",
    // readOnly = false,
    language,
}: JsonEditorProps) {
    const editorRef = useRef<any>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isValid, setIsValid] = useState(true);
    const isInitializedRef = useRef(false);

    const { theme } = useTheme();

    const validateJson = useCallback(
        (code: string) => {
            if (language !== "json") {
                setIsValid(true);
                return;
            }

            // Empty or whitespace-only strings are valid
            if (!code || !code.trim()) {
                setIsValid(true);
                return;
            }

            try {
                JSON.parse(code);
                setIsValid(true);
            } catch {
                setIsValid(false);
            }
        },
        [language],
    );

    useEffect(() => {
        if (!containerRef.current || isInitializedRef.current) return;

        // Ensure value is always a string
        const stringValue =
            typeof value === "string"
                ? value
                : value
                  ? JSON.stringify(value, null, 2)
                  : "";

        const editor = basicEditor(containerRef.current, {
            language,
            value: stringValue,
            lineNumbers: true,
            // readOnly,
            wordWrap: false,
            tabSize: 2,
            insertSpaces: true,
            theme: theme === "dark" ? "github-dark" : "github-light",
        });

        editorRef.current = editor;
        isInitializedRef.current = true;

        let isInitializing = true;
        const handleInput = () => {
            if (isInitializing) return;
            const code = editor.value;
            validateJson(code);
            onChange?.(code);
        };

        editor.on("update", handleInput);
        validateJson(stringValue);

        setTimeout(() => {
            isInitializing = false;
        }, 0);

        return () => {
            editor?.remove?.();
            editorRef.current = null;
            isInitializedRef.current = false;
        };
    }, [language]);

    useEffect(() => {
        if (!editorRef.current) return;
        const selectedTheme = theme === "dark" ? "github-dark" : "github-light";
        editorRef.current.setOptions({ theme: selectedTheme });
    }, [theme]);

    useEffect(() => {
        if (editorRef.current && isInitializedRef.current) {
            // Ensure value is always a string
            const stringValue =
                typeof value === "string"
                    ? value
                    : value
                      ? JSON.stringify(value, null, 2)
                      : "";
            const currentValue = editorRef.current.value;

            if (currentValue !== stringValue) {
                // Use the correct method to set value instead of direct assignment
                editorRef.current.update(stringValue);
                validateJson(stringValue);
            }
        }
    }, [value, validateJson]);

    return (
        <div className="w-full">
            <div className="flex justify-end mb-2">
                {language === "json" ? (
                    isValid ? (
                        <Badge
                            variant="secondary"
                            className="flex items-center gap-1.5 px-2.5 py-1 text-green-600 bg-green-600/10 border-none font-medium"
                        >
                            <CircleCheck className="h-3.5 w-3.5 text-green-600" />
                            Valid
                        </Badge>
                    ) : (
                        <Badge
                            variant="secondary"
                            className="flex items-center gap-1.5 px-2.5 py-1 text-red-600 bg-red-600/10 border-none font-medium"
                        >
                            <CircleAlert className="h-3.5 w-3.5 text-red-600" />
                            Invalid
                        </Badge>
                    )
                ) : null}
            </div>

            <div className="bg-card rounded-lg  border border-border overflow-hidden">
                <div className="bg-background relative">
                    <div
                        ref={containerRef}
                        className="w-full "
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
