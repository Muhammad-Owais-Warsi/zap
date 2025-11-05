import { Input } from "@/components/ui/input";
import { useZapRequest } from "@/store/request-store";
import { useCwdStore } from "@/store/cwd-store";
import { useEffect, useState } from "react";

export default function PlaygroundUrlInput() {
    const selectedFile = useCwdStore((state) => state.selectedFile);
    const getRequest = useZapRequest((state) => state.getRequest);
    const setUrl = useZapRequest((state) => state.setUrl);

    const [localUrl, setLocalUrl] = useState("");

    useEffect(() => {
        if (selectedFile?.path) {
            const request = getRequest(selectedFile.path);
            setLocalUrl(request?.url || "");
        } else {
            setLocalUrl("");
        }
    }, [selectedFile, getRequest]);

    function handleUrlChange(value: string) {
        setLocalUrl(value);
        if (selectedFile?.path) {
            setUrl(value, selectedFile.path);
        }
    }

    return (
        <div className="w-full min-w-0">
            <Input
                value={localUrl}
                className="w-full"
                placeholder="Enter request URL..."
                onChange={(e) => handleUrlChange(e.target.value)}
            />
        </div>
    );
}
