import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    ZapApiKeyAuth,
    ZapAuthType,
    ZapAuthConfig,
    ZapAuth,
} from "@/types/request";

export default function PlaygroundConfigAuthApiKeyAuth({
    auth,
    onChange,
}: {
    auth: ZapAuth;
    onChange: (type: ZapAuthType, config?: ZapAuthConfig) => void;
}) {
    return (
        <div className="space-y-6">
            <div className="space-y-3">
                <Label htmlFor="keyName" className="text-base font-medium">
                    Key Name
                </Label>
                <Input
                    id="keyName"
                    placeholder="e.g., X-API-Key"
                    value={(auth.config as ZapApiKeyAuth)?.key || ""}
                    onChange={(e) =>
                        onChange("api-key", {
                            ...(auth.config as ZapApiKeyAuth),
                            key: e.target.value,
                            value: (auth.config as ZapApiKeyAuth)?.value || "",
                            in: (auth.config as ZapApiKeyAuth)?.in || "header",
                        })
                    }
                    className="h-12 text-base"
                />
            </div>

            <div className="space-y-3">
                <Label htmlFor="keyValue" className="text-base font-medium">
                    Key Value
                </Label>
                <Input
                    id="keyValue"
                    placeholder="Enter your API key"
                    value={(auth.config as ZapApiKeyAuth)?.value || ""}
                    onChange={(e) =>
                        onChange("api-key", {
                            ...(auth.config as ZapApiKeyAuth),
                            value: e.target.value,
                            key: (auth.config as ZapApiKeyAuth)?.key || "",
                            in: (auth.config as ZapApiKeyAuth)?.in || "header",
                        })
                    }
                    className="h-12 text-base font-mono"
                />
            </div>

            <div className="space-y-3">
                <Label className="text-base font-medium">Send API Key In</Label>
                <Select
                    value={(auth.config as ZapApiKeyAuth)?.in || "header"}
                    onValueChange={(val: "header" | "param") =>
                        onChange("api-key", {
                            ...(auth.config as ZapApiKeyAuth),
                            in: val,
                            key: (auth.config as ZapApiKeyAuth)?.key || "",
                            value: (auth.config as ZapApiKeyAuth)?.value || "",
                        })
                    }
                >
                    <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="header">Request Header</SelectItem>
                        <SelectItem value="param">Query Parameter</SelectItem>
                    </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                    {(auth.config as ZapApiKeyAuth)?.in === "header"
                        ? "API key will be sent as a request header (more secure)"
                        : "API key will be sent as a query parameter in the URL"}
                </p>
            </div>
        </div>
    );
}
