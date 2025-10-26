import { useEffect, useRef, useState } from "react";
import { basicEditor } from "prism-code-editor/setups";
import "prism-code-editor/prism/languages/javascript"; // JSON highlighting

type CodeEditorProps = {
    value?: string;
    onChange?: (code: string) => void;
};

export default function JsonEditor({ value = "", onChange }: CodeEditorProps) {
    const editorRef = useRef<HTMLDivElement>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!editorRef.current) return;

        const editor = basicEditor(
            editorRef.current,
            {
                language: "javascript", // JSON highlighting
                theme: "github-dark",
                value,
            },
            () => console.log("Editor mounted"),
        );

        // Listen to changes
        editor.on("change", (code: string) => {
            if (onChange) onChange(code);

            try {
                JSON.parse(code);
                setError(null);
            } catch (e: any) {
                setError(e.message);
            }
        });

        return () => editor.destroy?.();
    }, [onChange]);

    return (
        <div style={{ position: "relative" }}>
            <div ref={editorRef} style={{ height: "400px" }} />
            {error && (
                <div
                    style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        background: "rgba(255,0,0,0.2)",
                        color: "red",
                        padding: "4px",
                        fontSize: "12px",
                    }}
                >
                    {error}
                </div>
            )}
        </div>
    );
}
