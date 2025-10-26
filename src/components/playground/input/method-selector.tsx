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
    const getRequest = useZapRequest((state) => state.getRequest);
    const selectedFile = useCwdStore((state) => state.selectedFile);
    const setMethod = useZapRequest((state) => state.setMethod);

    const currentRequest = useZapRequest((state) => {
        if (!selectedFile?.path) return undefined;
        return state.getRequest(selectedFile.path);
    });

    function handleMethodChange(value: string) {
        setMethod(selectedFile?.path!, value);
    }

    return (
        <div>
            <Select
                onValueChange={(value) => handleMethodChange(value)}
                value={currentRequest?.method || "GET"} // fallback if undefined
                disabled={!currentRequest} // disable select if no file selected
            >
                <SelectTrigger className="w-[180px]">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        {HTTP_METHODS.map((v) => (
                            <SelectItem value={v}>{v}</SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    );
}
