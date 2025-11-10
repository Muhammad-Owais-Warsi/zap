import { useCwdStore } from "@/store/cwd-store";
import PlaygroundTabs from "./tabs/tabs";
import PlaygroundMainInput from "./input/main";
import PlaygroundMainConfig from "./config/main";
import { Separator } from "../ui/separator";
import MarkdownEditor from "../ui/markdown";
import { cleanString } from "@/lib/clean-string";
import { writeZapFile } from "@/file-system/fs-operation";

export default function Render() {
    const selectedFile = useCwdStore((state) => state.selectedFile);

    const cleaned_markdown = cleanString(selectedFile?.content);

    const handleSave = async (content: string) => {
        const cleaned_content = cleanString(content);
        await writeZapFile(selectedFile?.path, cleaned_content);
    };

    return (
        <div className="flex flex-col flex-1 min-h-0 w-full bg-background text-foreground">
            <div>
                <div className="shrink-0">
                    <PlaygroundTabs />
                </div>

                {selectedFile?.path?.includes("README.md") ? (
                    <div className="p-6 overflow-auto">
                        <MarkdownEditor
                            initialContent={cleaned_markdown}
                            onSave={handleSave}
                        />
                    </div>
                ) : (
                    <div>
                        <div className="flex min-h-0 overflow-hidden">
                            <div className="w-full p-4 flex flex-col min-h-0 min-w-0">
                                <PlaygroundMainInput />
                            </div>
                        </div>

                        <Separator
                            orientation="horizontal"
                            className="w-full my-2"
                        />

                        <div className="flex min-h-0 overflow-hidden">
                            <div className="w-full pt-2 flex flex-col min-h-0 min-w-0">
                                <PlaygroundMainConfig />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
