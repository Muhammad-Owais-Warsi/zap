import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
    ZapBasicAuth,
    ZapAuthType,
    ZapAuthConfig,
    ZapAuth,
} from "@/types/request";

export default function PlaygroundConfigAuthBasicAuth({
    auth,
    onChange,
}: {
    auth: ZapAuth;
    onChange: (type: ZapAuthType, config?: ZapAuthConfig) => void;
}) {
    return (
        <div className="space-y-6">
            <div className="space-y-3">
                <Label htmlFor="username" className="text-base font-medium">
                    Username
                </Label>
                <Input
                    id="username"
                    placeholder="Enter your username"
                    value={(auth.config as ZapBasicAuth)?.username || ""}
                    onChange={(e) =>
                        onChange("basic", {
                            ...(auth.config as ZapBasicAuth),
                            username: e.target.value,
                        })
                    }
                    className="h-12 text-base"
                />
            </div>
            <div className="space-y-3">
                <Label htmlFor="password" className="text-base font-medium">
                    Password
                </Label>
                <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={(auth.config as ZapBasicAuth)?.password || ""}
                    onChange={(e) =>
                        onChange("basic", {
                            ...(auth.config as ZapBasicAuth),
                            password: e.target.value,
                        })
                    }
                    className="h-12 text-base"
                />
            </div>
        </div>
    );
}
