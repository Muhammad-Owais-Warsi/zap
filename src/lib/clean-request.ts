import { ZapRequestBody, ZapStoreRequest } from "@/store/request-store";
import { DEFAULT_HEADERS } from "@/file-system/fs-data";
import { NETWORK_CONFIG } from "@/file-system/fs-data";
import {
    ZapHeaders,
    ZapNetworkConfig,
    ZapQueryParams,
    ZapFormDataBodyType,
    ZapFormUrlEncodedBodyType,
    ZapCookie,
} from "@/types/request";
import { ZapWorkspaceConfig } from "@/types/fs";
import parseUrl from "./parse-url";
import { invoke } from "@tauri-apps/api/core";

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

export async function cleanRequestBeforeSending(
    request: ZapStoreRequest | undefined,
    workspaceConfig: ZapWorkspaceConfig,
    currentEnv: string,
    path: string,
) {
    if (!request) return;

    const headers = getKeyValue(request.headers || DEFAULT_HEADERS);
    const params = getKeyValue(request.queryParams || []);
    const body = getBody(request.body);
    const cookies = workspaceConfig.cookieJar;
    const networkConfig = getNetworkConfig(
        request.networkConfig || NETWORK_CONFIG,
    );

    const actual_url = parseUrl(
        request.url || "",
        workspaceConfig,
        currentEnv,
        path,
    );
    const requestPayload = {
        // name: request.name,
        // path: request.path,
        // type: "file",
        // content: {
        url: actual_url,
        method: request.method || "GET",
        headers: headers,
        body: body,
        params: params,
        cookies: cookies,
        auth: {
            type: request.auth?.type || "no-auth",
            config: request.auth?.config || undefined,
        },
        networkConfig: networkConfig,
        // },
    };
    console.log("here", requestPayload);
    const result = await invoke("make_request", {
        payload: requestPayload,
    });
    console.log(result);

    return requestPayload;
}

function getKeyValue(
    content:
        | ZapHeaders[]
        | ZapQueryParams[]
        | ZapFormDataBodyType[]
        | ZapFormUrlEncodedBodyType[],
) {
    const result = content
        .filter((v) => v.enabled)
        .map((v) => ({
            key: v.key,
            value: v.value,
        }));

    return result;
}

function getNetworkConfig(content: ZapNetworkConfig) {
    const result = content.map((v) => ({
        key: v.key,
        value: v.value,
    }));

    return result;
}

function getBody(content: ZapRequestBody | null) {
    console.log("clean", content);

    const body: {
        type: string;
        content: any;
    } = {
        type: "none",
        content: null,
    };

    if (!content) return body;

    switch (content.current) {
        case "none":
            body.type = "none";
            body.content = null;
            break;
        case "form-data":
            body.type = "form-data";
            body.content = getKeyValue(
                content.body?.["form-data"] || content?.["form-data"] || [],
            );
            break;
        case "x-www-form-urlencoded":
            body.type = "x-www-form-urlencoded";
            body.content = getKeyValue(
                content.body?.["x-www-form-urlencoded"] ||
                    content?.["x-www-form-urlencoded"] ||
                    [],
            );
            break;
        case "raw":
            body.type = "raw";
            body.content =
                content.body?.["raw"]?.[`${content?.language || "text"}`] ||
                content.raw?.[`${content.language}`] ||
                "";
            break;
    }
    return body;
}
