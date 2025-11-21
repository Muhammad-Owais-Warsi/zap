import {
    ZapHttpMethods,
    ZapHeaders,
    ZapQueryParams,
    ZapFormDataBodyType,
    ZapFormUrlEncodedBodyType,
    ZapAuthType,
    ZapCookie,
} from "@/types/request";
import { DEFAULT_HEADERS, NETWORK_CONFIG } from "@/file-system/fs-data";

export interface ParsedCurlRequest {
    name: string;
    path: string;
    type: "file";
    content: {
        url: string;
        method: ZapHttpMethods;
        headers: ZapHeaders[];
        body: {
            none: null;
            "form-data": ZapFormDataBodyType[];
            "x-www-form-urlencoded": ZapFormUrlEncodedBodyType[];
            raw: {
                text: string;
                json: string;
                javascript: string;
                html: string;
                xml: string;
            };
        };
        params: ZapQueryParams[];
        auth: {
            type: ZapAuthType;
            config?: any;
        };
        networkConfig: typeof NETWORK_CONFIG;
    };
}

export default function parseCurl(command: string, name: string, path: string) {
    const cleanCommand = trimSpace(command);

    const cookies: ZapCookie[] = [];
    const cookiesString: string[] = [];

    const parsedRequest: ParsedCurlRequest = {
        name,
        path,
        type: "file",
        content: {
            url: "",
            method: "GET",
            headers: DEFAULT_HEADERS,
            body: {
                none: null,
                "form-data": [],
                "x-www-form-urlencoded": [],
                raw: {
                    text: "",
                    json: "",
                    javascript: "",
                    html: "",
                    xml: "",
                },
            },
            params: [],
            auth: {
                type: "no-auth",
                config: undefined,
            },
            networkConfig: NETWORK_CONFIG,
        },
    };

    try {
        const tokens = tokenizeCurlCommand(cleanCommand);

        let i = 0;
        let url = "";
        let method: ZapHttpMethods = "GET";
        const headers: ZapHeaders[] = [];
        let rawBody = "";
        const formData: ZapFormDataBodyType[] = [];
        const urlEncodedData: ZapFormUrlEncodedBodyType[] = [];
        let auth: { type: ZapAuthType; config?: any } = {
            type: "no-auth",
            config: undefined,
        };

        if (tokens[i] === "curl") {
            i++;
        }

        while (i < tokens.length) {
            const token = tokens[i];

            if (token === "-X" || token === "--request") {
                i++;
                if (i < tokens.length) {
                    const methodToken = tokens[
                        i
                    ].toUpperCase() as ZapHttpMethods;
                    if (
                        [
                            "GET",
                            "POST",
                            "PUT",
                            "PATCH",
                            "DELETE",
                            "HEAD",
                            "OPTIONS",
                        ].includes(methodToken)
                    ) {
                        method = methodToken;
                    }
                }
            } else if (token === "-H" || token === "--header") {
                i++;
                if (i < tokens.length) {
                    const headerString = tokens[i];
                    const colonIndex = headerString.indexOf(":");
                    if (colonIndex > 0) {
                        const key = headerString
                            .substring(0, colonIndex)
                            .trim();
                        const value = headerString
                            .substring(colonIndex + 1)
                            .trim();

                        if (key.toLowerCase() === "authorization") {
                            const authResult = parseAuthHeader(value);
                            if (authResult) {
                                auth = authResult;
                            }
                        } else {
                            headers.push({
                                key,
                                value,
                                default: false,
                                description: "",
                                enabled: true,
                            });
                        }
                    }
                }
            } else if (
                token === "-d" ||
                token === "--data" ||
                token === "--data-raw"
            ) {
                i++;
                if (i < tokens.length) {
                    rawBody = tokens[i];
                    if (method === "GET") {
                        method = "POST";
                    }
                }
            } else if (
                token === "--data-urlencode" ||
                token === "--data-urlencoded"
            ) {
                i++;
                if (i < tokens.length) {
                    const dataString = tokens[i];
                    const eqIndex = dataString.indexOf("=");
                    if (eqIndex > 0) {
                        const key = dataString.substring(0, eqIndex);
                        const value = dataString.substring(eqIndex + 1);
                        urlEncodedData.push({
                            key,
                            value,
                            description: "",
                            enabled: true,
                        });
                    }
                    if (method === "GET") {
                        method = "POST";
                    }
                }
            } else if (token === "-F" || token === "--form") {
                i++;
                if (i < tokens.length) {
                    const formString = tokens[i];
                    const eqIndex = formString.indexOf("=");
                    if (eqIndex > 0) {
                        const key = formString.substring(0, eqIndex);
                        const value = formString.substring(eqIndex + 1);

                        const isFile = value.startsWith("@");
                        formData.push({
                            key,
                            value: isFile ? value.substring(1) : value,
                            type: isFile ? "file" : "text",
                            description: "",
                            enabled: true,
                        });
                    }
                    if (method === "GET") {
                        method = "POST";
                    }
                }
            } else if (token === "-u" || token === "--user") {
                i++;
                if (i < tokens.length) {
                    const userString = tokens[i];
                    const colonIndex = userString.indexOf(":");
                    if (colonIndex > 0) {
                        const username = userString.substring(0, colonIndex);
                        const password = userString.substring(colonIndex + 1);
                        auth = {
                            type: "basic",
                            config: { username, password },
                        };
                    }
                }
            } else if (token === "--user-agent") {
                i++;
                if (i < tokens.length) {
                    headers.push({
                        key: "User-Agent",
                        value: tokens[i],
                        default: false,
                        description: "",
                        enabled: true,
                    });
                }
            } else if (token === "--cookie" || token === "-b") {
                i++;
                if (i < tokens.length) {
                    const cookieString = tokens[i];
                    cookiesString.push(cookieString);
                }
            } else if (token === "--referer" || token === "-e") {
                i++;
                if (i < tokens.length) {
                    headers.push({
                        key: "Referer",
                        value: tokens[i],
                        default: false,
                        description: "",
                        enabled: true,
                    });
                }
            } else if (!token.startsWith("-") && !url) {
                url = token;
            }

            i++;
        }

        const { baseUrl, queryParams } = parseUrlAndParams(url);
        parsedRequest.content.url = baseUrl;
        parsedRequest.content.method = method;

        for (const c of cookiesString) {
            const parsed = parseCookieString(c, baseUrl);
            cookies.push(...parsed);
        }

        parsedRequest.content.headers = [...DEFAULT_HEADERS, ...headers];
        parsedRequest.content.params = queryParams;
        parsedRequest.content.auth = auth;

        if (rawBody) {
            const contentType = detectContentType(rawBody, headers);
            parsedRequest.content.body.raw[contentType] = rawBody;
        }

        if (formData.length > 0) {
            parsedRequest.content.body["form-data"] = formData;
        }

        if (urlEncodedData.length > 0) {
            parsedRequest.content.body["x-www-form-urlencoded"] =
                urlEncodedData;
        }
    } catch (error) {
        console.error("Error parsing curl command:", error);
        throw new Error(
            `Failed to parse curl command: ${error instanceof Error ? error.message : "Unknown error"}`,
        );
    }

    return { parsedRequest, cookies };
}

function tokenizeCurlCommand(command: string): string[] {
    const tokens: string[] = [];
    let current = "";
    let inQuotes = false;
    let quoteChar = "";
    let i = 0;

    while (i < command.length) {
        const char = command[i];

        if (!inQuotes && (char === '"' || char === "'")) {
            inQuotes = true;
            quoteChar = char;
        } else if (inQuotes && char === quoteChar) {
            if (i + 1 < command.length && command[i + 1] === quoteChar) {
                current += char;
                i++;
            } else {
                inQuotes = false;
                quoteChar = "";
            }
        } else if (!inQuotes && /\s/.test(char)) {
            if (current.trim()) {
                tokens.push(current.trim());
                current = "";
            }
            while (i + 1 < command.length && /\s/.test(command[i + 1])) {
                i++;
            }
        } else {
            current += char;
        }
        i++;
    }

    if (current.trim()) {
        tokens.push(current.trim());
    }

    return tokens.map((token) => {
        return token
            .replace(/\^\\\^"/g, '"')
            .replace(/\^"/g, '"')
            .replace(/"\^/g, '"');
    });
}

function parseAuthHeader(
    authValue: string,
): { type: ZapAuthType; config?: any } | null {
    const trimmedValue = authValue.trim();

    if (trimmedValue.toLowerCase().startsWith("bearer ")) {
        return {
            type: "bearer",
            config: { token: trimmedValue.substring(7) },
        };
    } else if (trimmedValue.toLowerCase().startsWith("basic ")) {
        try {
            const base64Credentials = trimmedValue.substring(6);
            const decoded = atob(base64Credentials);
            const colonIndex = decoded.indexOf(":");
            if (colonIndex > 0) {
                return {
                    type: "basic",
                    config: {
                        username: decoded.substring(0, colonIndex),
                        password: decoded.substring(colonIndex + 1),
                    },
                };
            }
        } catch (e) {
            console.warn("Failed to decode basic auth:", e);
        }
    }

    return null;
}

function parseUrlAndParams(url: string): {
    baseUrl: string;
    queryParams: ZapQueryParams[];
} {
    if (!url) {
        return { baseUrl: "", queryParams: [] };
    }

    try {
        const urlObj = new URL(url);
        const queryParams: ZapQueryParams[] = [];

        urlObj.searchParams.forEach((value, key) => {
            queryParams.push({
                key,
                value,
                enabled: true,
            });
        });

        const baseUrl = `${urlObj.protocol}//${urlObj.host}${urlObj.pathname}`;

        return { baseUrl, queryParams };
    } catch (error) {
        return { baseUrl: url, queryParams: [] };
    }
}

function parseCookieString(cookieString: string, url: string): ZapCookie[] {
    const cookies: ZapCookie[] = [];

    let domain = "";
    let secure = false;

    try {
        const parsedUrl = new URL(url);
        domain = parsedUrl.hostname;
        secure = parsedUrl.protocol === "https:";
    } catch (e) {
        domain = "";
    }

    const cookiePairs = cookieString.split(";");

    for (const pair of cookiePairs) {
        const trimmedPair = pair.trim();
        const equalIndex = trimmedPair.indexOf("=");

        if (equalIndex > 0) {
            const key = trimmedPair.substring(0, equalIndex).trim();
            const value = trimmedPair.substring(equalIndex + 1).trim();

            cookies.push({
                key,
                value,
                domain,
                path: "/",
                secure,
                httpOnly: false,
                sameSite: "Lax",
            });
        }
    }

    return cookies;
}

function detectContentType(
    body: string,
    headers: ZapHeaders[],
): keyof ParsedCurlRequest["content"]["body"]["raw"] {
    const contentTypeHeader = headers.find(
        (h) => h.key.toLowerCase() === "content-type",
    );

    if (contentTypeHeader) {
        const contentType = contentTypeHeader.value.toLowerCase();
        if (contentType.includes("application/json")) return "json";
        if (contentType.includes("text/html")) return "html";
        if (
            contentType.includes("application/xml") ||
            contentType.includes("text/xml")
        )
            return "xml";
        if (
            contentType.includes("application/javascript") ||
            contentType.includes("text/javascript")
        )
            return "javascript";
    }

    const trimmedBody = body.trim();

    if (
        (trimmedBody.startsWith("{") && trimmedBody.endsWith("}")) ||
        (trimmedBody.startsWith("[") && trimmedBody.endsWith("]"))
    ) {
        try {
            JSON.parse(trimmedBody);
            return "json";
        } catch (e) {
            console.log("Not valid json from parse curl");
        }
    }

    if (
        trimmedBody.toLowerCase().includes("<html") ||
        trimmedBody.toLowerCase().includes("<!doctype html")
    ) {
        return "html";
    }

    if (
        trimmedBody.startsWith("<?xml") ||
        (trimmedBody.startsWith("<") &&
            !trimmedBody.toLowerCase().includes("<html"))
    ) {
        return "xml";
    }

    return "text";
}

function trimSpace(content: string) {
    let cleaned = content.trim().replace(/\\\s*\n\s*/g, " ");
    cleaned = cleanWindowsCaretEscaping(cleaned);
    return cleaned;
}

function cleanWindowsCaretEscaping(content: string): string {
    let cleaned = content.replace(/\^\s+/g, " ");
    cleaned = cleaned.replace(/\^\\\^"/g, '"');
    cleaned = cleaned.replace(/\^"([^"]*)\^"/g, '"$1"');
    cleaned = cleaned.replace(/\s\^\s/g, " ");
    cleaned = cleaned.replace(/^\^/, "");
    cleaned = cleaned.replace(/\^$/, "");
    cleaned = cleaned.replace(/\s+/g, " ");
    return cleaned.trim();
}
