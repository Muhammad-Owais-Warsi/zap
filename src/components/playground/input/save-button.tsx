import { Button } from "@/components/ui/button";
import { useCwdStore } from "@/store/cwd-store";
import { useZapRequest } from "@/store/request-store";
import { AlertCircle, Save } from "lucide-react";
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
        <div className="flex-none">
            <Button
                variant="outline"
                className="relative hover:cursor-pointer flex items-center gap-2"
            >
                <Save className="h-4 w-4" />
                {isSave ? (
                    "Save"
                ) : (
                    <>
                        Save{" "}
                        <span className="h-2 w-2 rounded-full bg-blue-300" />
                    </>
                )}
            </Button>
        </div>
    );
}
