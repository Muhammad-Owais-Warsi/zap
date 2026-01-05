import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
    SelectGroup,
} from "@/components/ui/select";
import { FileSystemOperations } from "@/lib/fs/fs";
import { useTabsStore } from "@/store/new/tabs-store";
import { ZapHttpMethods } from "@/types/request";

const HTTP_METHODS = [
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
    "HEAD",
    "OPTIONS",
];

export default function PlaygroundMethodSelector() {
    const activeTab = useTabsStore().activeTab;

    function handleMethodChange(value: string) {
        if (!activeTab) return;
        FileSystemOperations.updateFileAndTabMethod(
            activeTab.path,
            value as ZapHttpMethods,
        );
    }

    return (
        <div className="flex-none">
            <Select
                onValueChange={handleMethodChange}
                value={activeTab?.method}
                disabled={!activeTab}
            >
                <SelectTrigger className="w-[120px] hover:cursor-pointer">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        {HTTP_METHODS.map((v) => (
                            <SelectItem
                                key={v}
                                value={v}
                                className="hover:cursor-pointer"
                            >
                                {v}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    );
}
