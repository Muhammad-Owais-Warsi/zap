import { Button } from "@/components/ui/button";
import { useTabsStore } from "@/store/new/tabs-store";
import { Save } from "lucide-react";

export default function PlaygroundSaveButton() {
    const activeTab = useTabsStore().activeTab;

    return (
        <div className="flex-none">
            <Button
                variant="outline"
                className="relative hover:cursor-pointer flex items-center gap-2"
                // onClick={handleSave}
            >
                <Save className="h-4 w-4" />
                {!activeTab?.isDirty ? (
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
