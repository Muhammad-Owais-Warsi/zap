import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

export default function PlaygroundSubmitButton() {
    return (
        <div className="flex-none">
            <Button className="hover:cursor-pointer">
                <Send /> Send
            </Button>
        </div>
    );
}
