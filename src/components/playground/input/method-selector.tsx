import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
    SelectGroup,
} from "@/components/ui/select";
import { useCwdStore } from "@/store/cwd-store";
import { useZapRequest } from "@/store/request-store";

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
    const selectedFile = useCwdStore((state) => state.selectedFile);
    const setMethod = useZapRequest((state) => state.setMethod);

    const currentRequest = useZapRequest((state) => {
        if (!selectedFile?.path) return undefined;
        return state.getRequest(selectedFile.path);
    });

    function handleMethodChange(value: string) {
        setMethod(value, selectedFile?.path!);
    }

    return (
        <div className="flex-none">
            <Select
                onValueChange={(value) => handleMethodChange(value)}
                value={currentRequest?.method || "GET"}
                disabled={!currentRequest}
            >
                <SelectTrigger className="w-[120px] hover:cursor-pointer">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        {HTTP_METHODS.map((v) => (
                            <SelectItem
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
