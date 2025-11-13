import { ZapStoreRequest } from "@/store/request-store";
import { DEFAULT_HEADERS } from "@/file-system/fs-data";
import { NETWORK_CONFIG } from "@/file-system/fs-data";

export default function cleanRequest(request: ZapStoreRequest | undefined) {
    if (!request) return;
    const requestPayload = {
        name: request.name,
        path: request.path,
        type: "file",
        content: {
            url: request.url || "",
            method: request.method || "GET",
            headers: request.headers || DEFAULT_HEADERS,
            body: {
                none: null,
                "form-data": request.body?.body["form-data"] || [],
                "x-www-form-urlencoded":
                    request.body?.body["x-www-form-urlencoded"] || [],
                // raw: {
                //     text:
                //         request.body?.body.raw.text ||
                //         // request.body?.raw.text ||
                //         "",
                //     json:
                //         request.body?.body.raw.json ||
                //         // request.body?.raw.json ||
                //         "",
                //     javascript:
                //         request.body?.body.raw.javascript ||
                //         // request.body?.raw.javascript ||
                //         "",
                //     html:
                //         request.body?.body.raw.html ||
                //         // request.body?.raw.html ||
                //         "",
                //     xml:
                //         request.body?.body.raw.xml ||
                //         // request.body?.raw.xml ||
                //         "",
                // },
                raw: {
                    text: request.body?.body?.raw?.text || "",
                    json: request.body?.body?.raw?.json || "",
                    javascript: request.body?.body?.raw?.javascript || "",
                    html: request.body?.body?.raw?.html || "",
                    xml: request.body?.body?.raw?.xml || "",
                },
            },
            params: request.queryParams || [],
            auth: {
                type: request.auth?.type || "no-auth",
                config: request.auth?.config || undefined,
            },
            networkConfig: request.networkConfig || NETWORK_CONFIG,
        },
    };

    return requestPayload;
}
