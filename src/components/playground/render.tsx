import { useCwdStore } from "@/store/cwd-store";
import PlaygroundTabs from "./tabs/tabs";
import PlaygroundMainInput from "./input/main";
import PlaygroundMainConfig from "./config/main";
import { Separator } from "../ui/separator";

export default function Render() {
    const selectedFile = useCwdStore((state) => state.selectedFile);

    return (
        <div className="flex flex-col flex-1 min-h-0 w-full bg-background text-foreground">
            <div className="shrink-0">
                <PlaygroundTabs />
            </div>

            <div className="flex min-h-0 overflow-hidden">
                <div className="w-full p-4 flex flex-col min-h-0 min-w-0">
                    <PlaygroundMainInput />
                </div>
            </div>
            <Separator orientation="horizontal" className="w-full my-2" />

            <div className="flex min-h-0 overflow-hidden ">
                <div className="w-full pt-2 flex flex-col min-h-0 min-w-0">
                    <PlaygroundMainConfig />
                </div>
            </div>
        </div>
    );
}
