import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
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
import {
    ZapAuth,
    ZapAuthConfig,
    ZapApiKeyAuth,
    ZapAuthType,
    ZapBasicAuth,
    ZapBearerAuth,
} from "@/types/request";

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
                        <div className="space-y-6">
                            <div className="space-y-3">
                                <Label
                                    htmlFor="username"
                                    className="text-base font-medium"
                                >
                                    Username
                                </Label>
                                <Input
                                    id="username"
                                    placeholder="Enter your username"
                                    value={
                                        (auth.config as ZapBasicAuth)
                                            ?.username || ""
                                    }
                                    onChange={(e) =>
                                        updateAuth("basic", {
                                            ...(auth.config as ZapBasicAuth),
                                            username: e.target.value,
                                        })
                                    }
                                    className="h-12 text-base"
                                />
                            </div>
                            <div className="space-y-3">
                                <Label
                                    htmlFor="password"
                                    className="text-base font-medium"
                                >
                                    Password
                                </Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Enter your password"
                                    value={
                                        (auth.config as ZapBasicAuth)
                                            ?.password || ""
                                    }
                                    onChange={(e) =>
                                        updateAuth("basic", {
                                            ...(auth.config as ZapBasicAuth),
                                            password: e.target.value,
                                        })
                                    }
                                    className="h-12 text-base"
                                />
                            </div>
                        </div>
                    )}

                    {auth.type === "bearer" && (
                        <div className="space-y-6">
                            <Label
                                htmlFor="token"
                                className="text-base font-medium"
                            >
                                Access Token
                            </Label>
                            <Input
                                id="token"
                                placeholder="Enter your bearer token"
                                value={
                                    (auth.config as ZapBearerAuth)?.token || ""
                                }
                                onChange={(e) =>
                                    updateAuth("bearer", {
                                        token: e.target.value,
                                    })
                                }
                                className="h-12 text-base font-mono"
                            />
                        </div>
                    )}

                    {auth.type === "no-auth" && (
                        <div className="flex items-center justify-center h-full">
                            {" "}
                            <div className="text-center space-y-3 flex justify-center items-center flex-col">
                                {" "}
                                <div className="text-4xl ">
                                    {" "}
                                    <Unlock />{" "}
                                </div>{" "}
                                <h3 className="text-lg font-medium">
                                    {" "}
                                    No Authentication Required{" "}
                                </h3>{" "}
                                <p className="text-muted-foreground">
                                    {" "}
                                    Your request will be sent without
                                    authentication headers{" "}
                                </p>{" "}
                            </div>{" "}
                        </div>
                    )}

                    {auth.type === "api-key" && (
                        <div className="space-y-6">
                            <div className="space-y-3">
                                <Label
                                    htmlFor="keyName"
                                    className="text-base font-medium"
                                >
                                    Key Name
                                </Label>
                                <Input
                                    id="keyName"
                                    placeholder="e.g., X-API-Key"
                                    value={
                                        (auth.config as ZapApiKeyAuth)?.key ||
                                        ""
                                    }
                                    onChange={(e) =>
                                        updateAuth("api-key", {
                                            ...(auth.config as ZapApiKeyAuth),
                                            key: e.target.value,
                                            value:
                                                (auth.config as ZapApiKeyAuth)
                                                    ?.value || "",
                                            in:
                                                (auth.config as ZapApiKeyAuth)
                                                    ?.in || "header",
                                        })
                                    }
                                    className="h-12 text-base"
                                />
                            </div>

                            <div className="space-y-3">
                                <Label
                                    htmlFor="keyValue"
                                    className="text-base font-medium"
                                >
                                    Key Value
                                </Label>
                                <Input
                                    id="keyValue"
                                    placeholder="Enter your API key"
                                    value={
                                        (auth.config as ZapApiKeyAuth)?.value ||
                                        ""
                                    }
                                    onChange={(e) =>
                                        updateAuth("api-key", {
                                            ...(auth.config as ZapApiKeyAuth),
                                            value: e.target.value,
                                            key:
                                                (auth.config as ZapApiKeyAuth)
                                                    ?.key || "",
                                            in:
                                                (auth.config as ZapApiKeyAuth)
                                                    ?.in || "header",
                                        })
                                    }
                                    className="h-12 text-base font-mono"
                                />
                            </div>

                            <div className="space-y-3">
                                <Label className="text-base font-medium">
                                    Send API Key In
                                </Label>
                                <Select
                                    value={
                                        (auth.config as ZapApiKeyAuth)?.in ||
                                        "header"
                                    }
                                    onValueChange={(val: "header" | "param") =>
                                        updateAuth("api-key", {
                                            ...(auth.config as ZapApiKeyAuth),
                                            in: val,
                                            key:
                                                (auth.config as ZapApiKeyAuth)
                                                    ?.key || "",
                                            value:
                                                (auth.config as ZapApiKeyAuth)
                                                    ?.value || "",
                                        })
                                    }
                                >
                                    <SelectTrigger className="h-12">
                                        <SelectValue placeholder="Select location" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="header">
                                            Request Header
                                        </SelectItem>
                                        <SelectItem value="param">
                                            Query Parameter
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <p className="text-xs text-muted-foreground">
                                    {(auth.config as ZapApiKeyAuth)?.in ===
                                    "header"
                                        ? "API key will be sent as a request header (more secure)"
                                        : "API key will be sent as a query parameter in the URL"}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
