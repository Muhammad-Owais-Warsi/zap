import { Input } from "@/components/ui/input";
import { useZapRequest } from "@/store/request-store";
import { useCwdStore } from "@/store/cwd-store";

export default function PlaygroundUrlInput() {
    // const getRequest = useZapRequest((state) => state.getRequest);
    const selectedFile = useCwdStore((state) => state.selectedFile);
    const setUrl = useZapRequest((state) => state.setUrl);

    function handleUrlChange(value: string) {
        setUrl(value, selectedFile?.path!);
    }

    return (
        <div>
            <Input
                placeholder="Enter request URL..."
                onChange={(e) => handleUrlChange(e.target.value)}
            />
        </div>
    );
}
