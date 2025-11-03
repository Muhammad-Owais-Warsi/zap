import { useCwdStore } from "@/store/cwd-store";
import PlaygroundTabs from "./tabs/tabs";
import PlaygroundMainInput from "./input/main";
import PlaygroundMainConfig from "./config/main";

export default function Render() {
    const selectedFile = useCwdStore((state) => state.selectedFile);

    return (
        <div className="flex flex-col flex-1 min-h-0 w-full bg-background text-foreground">
            <div className="shrink-0">
                <PlaygroundTabs />
            </div>

            <div className="flex flex-1 min-h-0 overflow-hidden">
                {/* Make left column take remaining space and allow children to shrink */}
                <div className="flex-1 p-4 flex flex-col min-h-0 min-w-0">
                    <PlaygroundMainInput />
                </div>

                {/* Right column stays half width (or change to a fixed w-[xxx] if you prefer) */}
            </div>
        </div>
    );
}
