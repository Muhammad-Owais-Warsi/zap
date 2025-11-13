import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { useZapRequest } from "@/store/request-store";
import { useCwdStore } from "@/store/cwd-store";
import { Unlock } from "lucide-react";
import { ZapAuth, ZapAuthConfig, ZapAuthType } from "@/types/request";
import PlaygroundConfigAuthNoAuth from "./none";
import PlaygroundConfigAuthBasicAuth from "./basic";
import PlaygroundConfigAuthBearerAuth from "./bearer";
import PlaygroundConfigAuthApiKeyAuth from "./api-key";

export default function PlaygroundConfigAuth() {
    const selectedFile = useCwdStore((state) => state.selectedFile);
    const authFromStore = useZapRequest(
        (state) => state.getRequest(selectedFile?.path)?.auth,
    );
    const setAuth = useZapRequest((state) => state.setAuth);

    const [auth, setLocalAuth] = useState<ZapAuth>({
        type: "no-auth",
        config: undefined,
    });

    useEffect(() => {
        if (authFromStore) setLocalAuth(authFromStore);
    }, [authFromStore]);

    const updateAuth = (type: ZapAuthType, config?: ZapAuthConfig) => {
        const newAuth: ZapAuth = { type, config };
        setLocalAuth(newAuth);
        if (selectedFile?.path) {
            setAuth(newAuth, selectedFile.path);
        }
    };

    const getAuthDescription = () => {
        switch (auth.type) {
            case "no-auth":
                return "Request will be sent without authentication headers";
            case "basic":
                return "Username and password encoded in Base64 format";
            case "bearer":
                return "Token sent in Authorization header with 'Bearer' prefix";
            case "api-key":
                return "Custom API key sent as header or query parameter";
            default:
                return "";
        }
    };

    return (
        <div className="p-6">
            <div className="mb-6">
                <h2 className="text-xl font-semibold">Authentication</h2>
                <p className="text-sm text-muted-foreground mt-1">
                    Configure authentication method for your API request
                </p>
            </div>

            <div className="flex gap-6 min-h-[400px]">
                <div className="w-64 space-y-4">
                    <div>
                        <Label className="text-base font-medium">
                            Authentication Type
                        </Label>
                        <Select
                            value={auth.type}
                            onValueChange={(val: ZapAuthType) =>
                                updateAuth(val)
                            }
                        >
                            <SelectTrigger className="w-full h-12 mt-2">
                                <SelectValue placeholder="Select Auth Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="no-auth">
                                    No Authentication
                                </SelectItem>
                                <SelectItem value="basic">
                                    Basic Auth
                                </SelectItem>
                                <SelectItem value="bearer">
                                    Bearer Token
                                </SelectItem>
                                <SelectItem value="api-key">API Key</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="rounded-lg p-4">
                        {auth.type === "no-auth" && (
                            <div className="flex flex-col items-center gap-2">
                                <Unlock className="text-4xl" />
                            </div>
                        )}
                        <p className="text-xs text-muted-foreground leading-relaxed mt-2">
                            {getAuthDescription()}
                        </p>
                    </div>
                </div>

                <div className="w-px bg-border"></div>

                <div className="flex-1 space-y-6">
                    {auth.type === "basic" && (
                        <PlaygroundConfigAuthBasicAuth
                            auth={auth}
                            onChange={updateAuth}
                        />
                    )}

                    {auth.type === "bearer" && (
                        <PlaygroundConfigAuthBearerAuth
                            auth={auth}
                            onChange={updateAuth}
                        />
                    )}

                    {auth.type === "no-auth" && <PlaygroundConfigAuthNoAuth />}

                    {auth.type === "api-key" && (
                        <PlaygroundConfigAuthApiKeyAuth
                            auth={auth}
                            onChange={updateAuth}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
