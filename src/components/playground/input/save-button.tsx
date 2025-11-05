import { Button } from "@/components/ui/button";
import { useCwdStore } from "@/store/cwd-store";
import { useZapRequest } from "@/store/request-store";
import { Save } from "lucide-react";

export default function PlaygroundSaveButton() {
    const selectedFile = useCwdStore((state) => state.selectedFile);
    const isSaved = useZapRequest(
        (state) => state.getRequest(selectedFile?.path)?.isSaved,
    );
    const markSaved = useZapRequest((state) => state.markSaved);

    // logic for saving
    // maybe follow this
    // - first save in store
    // - then actual file

    return (
        <div className="flex-none">
            <Button
                variant="outline"
                className="relative hover:cursor-pointer flex items-center gap-2"
            >
                <Save className="h-4 w-4" />
                {isSaved ? (
                    "Save"
                ) : (
                    <>
                        Save{" "}
                        <span className="h-2 w-2 rounded-full bg-primary" />
                    </>
                )}
            </Button>
        </div>
    );
}
