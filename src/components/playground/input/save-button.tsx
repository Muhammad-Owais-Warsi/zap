import { Button } from "@/components/ui/button";
import { useCwdStore } from "@/store/cwd-store";
import { useZapRequest } from "@/store/request-store";
import { useEffect } from "react";

export default function PlaygroundSaveButton() {
    const selectedFile = useCwdStore((state) => state.selectedFile);
    const getRequest = useZapRequest((state) => state.getRequest);
    const markSaved = useZapRequest((state) => state.markSaved);

    let isSave = false;

    useEffect(() => {
        if (selectedFile) {
            const req = getRequest(selectedFile?.path);
            isSave = req?.isSaved || false;
        }
    }, [getRequest, markSaved]);

    return (
        <div>
            <Button>{isSave ? "Save" : "Please Save"}</Button>
        </div>
    );
}
