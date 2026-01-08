import PlaygroundTabs from "./tabs/tabs";
import PlaygroundMainInput from "./input/main";
import PlaygroundMainConfig from "./config/main";
import { Separator } from "../ui/separator";
import MarkdownEditor from "../ui/markdown";
import { cleanString } from "@/lib/clean-string";
import { writeZapFile } from "@/file-system/fs-operation";
import { useFileSystemStore } from "@/store/file-system";
import { useTabsStore } from "@/store/tabs-store";

export default function Render() {
    const activeFile = useFileSystemStore().activeFile;
    const activeTab = useTabsStore().activeTab;

    const handleSave = async (content: string) => {
        const cleaned_content = cleanString(content);
        if (activeFile) await writeZapFile(activeFile, cleaned_content);
    };

    return (
        <div className="flex flex-col flex-1 min-h-0 w-full bg-background text-foreground">
            <div className="flex flex-col flex-1 min-h-0">
                <div className="shrink-0">
                    <PlaygroundTabs />
                </div>

                {activeFile?.includes("README.md") ? (
                    <div className="p-6 overflow-auto flex-1">
                        <MarkdownEditor
                            initialContent={cleanString(activeTab?.content)}
                            onSave={handleSave}
                        />
                    </div>
                ) : activeFile ? (
                    <div className="flex-1 flex flex-col min-h-0">
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
                ) : (
                    <div className="flex-1 flex items-center justify-center">
                        <p className="text-lg text-muted-foreground text-center">
                            A lightweight{" "}
                            <span className="text-[oklch(0.7392_0.1154_242.0535)]">
                                API client
                            </span>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
