import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
    ZapBearerAuth,
    ZapAuthType,
    ZapAuthConfig,
    ZapAuth,
} from "@/types/request";

export default function PlaygroundConfigAuthBearerAuth({
    auth,
    onChange,
}: {
    auth: ZapAuth;
    onChange: (type: ZapAuthType, config?: ZapAuthConfig) => void;
}) {
    return (
        <div className="space-y-6">
            <Label htmlFor="token" className="text-base font-medium">
                Access Token
            </Label>
            <Input
                id="token"
                placeholder="Enter your bearer token"
                value={(auth.config as ZapBearerAuth)?.token || ""}
                onChange={(e) =>
                    onChange("bearer", {
                        token: e.target.value,
                    })
                }
                className="h-12 text-base font-mono"
            />
        </div>
    );
}
