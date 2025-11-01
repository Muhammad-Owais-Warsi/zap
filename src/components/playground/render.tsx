import { useCwdStore } from "@/store/cwd-store";
import PlaygroundTabs from "./tabs/tabs";
import PlaygroundMainInput from "./input/main";
import PlaygroundMainConfig from "./config/main";
import PlaygroundFooter from "./footer";
import { ModeToggle } from "../theme/theme-toggle";

export default function Render() {
    const selectedFile = useCwdStore((state) => state.selectedFile);

    return (
        <div className="flex flex-col h-full w-full bg-background text-foreground">
            <div className="border-b border-border bg-muted/40">
                <PlaygroundTabs />
            </div>

            {/* Toolbar / Header (optional controls like theme) */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-background/80 backdrop-blur-sm">
                <div className="text-sm font-medium text-muted-foreground">
                    Request Configuration
                </div>
            </div>

            {/* Main Body */}
            <div className="flex flex-1 overflow-hidden">
                {/* Left Input Panel */}
                <div className="w-1/2 border-r border-border p-4 overflow-auto">
                    <PlaygroundMainInput />
                </div>

                {/* Right Config / Output Panel */}
                <div className="w-1/2 p-4 overflow-auto">
                    <PlaygroundMainConfig />

                    <div className="mt-4 rounded-md border border-border bg-muted/30 p-3 text-sm font-mono">
                        {typeof selectedFile?.content === "string"
                            ? selectedFile?.content
                            : JSON.stringify(selectedFile?.content, null, 2)}
                    </div>
                </div>
            </div>
        </div>
    );
}
