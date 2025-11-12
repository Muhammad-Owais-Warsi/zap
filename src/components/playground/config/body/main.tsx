import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Unlock } from "lucide-react";

import PlaygroundBodyFormData from "./form-data";
import PlaygroundBodyXwwwFormUrlencoded from "./x-www-form-urlencoded";
import PlaygroundBodyRaw from "./raw";
import { useZapRequest } from "@/store/request-store";
import { useCwdStore } from "@/store/cwd-store";
import { ZapBodyType } from "@/types/request";

const BODY_TYPES = [
    { title: "None", value: "none" },
    { title: "Form Data", value: "form-data" },
    { title: "x-www-form-urlencoded", value: "x-www-form-urlencoded" },
    { title: "Raw", value: "raw" },
];

export default function PlaygroundMainBodyConfig() {
    const selectedFile = useCwdStore((state) => state.selectedFile);
    const setCurrentBody = useZapRequest((state) => state.setCurrentBody);

    const currentRequest = useZapRequest((state) => {
        if (!selectedFile?.path) return undefined;
        return state.getRequest(selectedFile.path);
    });

    const handleBodyTypeChange = (value: ZapBodyType) => {
        if (!selectedFile?.path) return undefined;
        setCurrentBody(value, selectedFile?.path);
    };

    const renderConfigContent = () => {
        switch (currentRequest?.body?.current) {
            case "none":
                return (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center space-y-3 flex flex-col items-center justify-center">
                            <div className="text-4xl text-muted-foreground">
                                <Unlock />
                            </div>
                            <h3 className="text-lg font-medium">
                                No Request Body
                            </h3>
                            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
                                No body will be sent with your request
                            </p>
                        </div>
                    </div>
                );
            case "form-data":
                return <PlaygroundBodyFormData />;
            case "x-www-form-urlencoded":
                return (
                    <PlaygroundBodyXwwwFormUrlencoded
                        path={selectedFile?.path}
                    />
                );
            case "raw":
                return <PlaygroundBodyRaw path={selectedFile?.path} />;
            default:
                return null;
        }
    };

    return (
        <div className="w-full">
            <div className="mb-6">
                <h2 className="text-xl font-semibold">Request Body</h2>
                <p className="text-sm text-muted-foreground mt-1">
                    Configure how data should be sent with your API request
                </p>
            </div>

            <div className="flex gap-6 min-h-[400px]">
                <div className="w-64 space-y-4">
                    <div>
                        <Label className="text-base font-medium">
                            Body Type
                        </Label>
                        <Select
                            value={currentRequest?.body?.current}
                            onValueChange={(value) =>
                                handleBodyTypeChange(value as ZapBodyType)
                            }
                        >
                            <SelectTrigger className="w-full h-12 mt-2 hover:cursor-pointer">
                                <SelectValue placeholder="Select Body Type" />
                            </SelectTrigger>
                            <SelectContent className="hover:cursor-pointer">
                                {BODY_TYPES.map((body) => (
                                    <SelectItem
                                        value={body.value}
                                        className="hover:cursor-pointer"
                                    >
                                        {body.title}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="w-px bg-border" />

                <div className="flex-1">{renderConfigContent()}</div>
            </div>
        </div>
    );
}

//TODO
// Just check wether the handle fucn can be optimized and inw aht ways and get better options
