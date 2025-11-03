import { Input } from "@/components/ui/input";
import { useZapRequest } from "@/store/request-store";
import { useCwdStore } from "@/store/cwd-store";

export default function PlaygroundUrlInput() {
    const selectedFile = useCwdStore((state) => state.selectedFile);
    const setUrl = useZapRequest((state) => state.setUrl);

    function handleUrlChange(value: string) {
        setUrl(value, selectedFile?.path!);
    }

    return (
        <div className="w-full min-w-0">
            <Input
                className="w-full"
                placeholder="Enter request URL..."
                onChange={(e) => handleUrlChange(e.target.value)}
            />
        </div>
    );
}
