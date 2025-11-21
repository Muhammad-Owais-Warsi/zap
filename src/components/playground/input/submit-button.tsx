import { Button } from "@/components/ui/button";
import { cleanRequestBeforeSending } from "@/lib/clean-request";
import { useCwdStore } from "@/store/cwd-store";
import { useZapRequest } from "@/store/request-store";
import { useVariableStore } from "@/store/variable-store";
import { Send } from "lucide-react";

export default function PlaygroundSubmitButton() {
    const selectedFile = useCwdStore((state) => state.selectedFile);
    const getRequest = useZapRequest((state) => state.getRequest);

    const currentEnv = useVariableStore((state) => state.current);
    const workspaceConfig = useCwdStore((state) => state.workspaceConfig);

    const handleSend = async () => {
        if (!selectedFile && workspaceConfig) return;
        const request = getRequest(selectedFile?.path!);
        console.log(
            await cleanRequestBeforeSending(
                request,
                workspaceConfig!,
                currentEnv,
                selectedFile?.path!,
            ),
        );
    };

    return (
        <div className="flex-none">
            <Button className="hover:cursor-pointer" onClick={handleSend}>
                <Send /> Send
            </Button>
        </div>
    );
}
