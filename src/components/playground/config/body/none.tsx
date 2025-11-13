import { Unlock } from "lucide-react";

export default function PlaygroundBodyNone() {
    return (
        <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-3 flex flex-col items-center justify-center">
                <div className="text-4xl text-muted-foreground">
                    <Unlock />
                </div>
                <h3 className="text-lg font-medium">No Request Body</h3>
                <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
                    No body will be sent with your request
                </p>
            </div>
        </div>
    );
}
