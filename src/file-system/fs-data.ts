import { ZapHeaders, ZapNetworkConfig } from "@/types/request";
import { ZapWorkspaceConfig, ZapFileConfig, ZapFolderConfig } from "@/types/fs";

export function create_workspcae_config_content(name: string, path: string) {
    const CREATE_WORKSPACE_CONFIG_CONTENT: ZapWorkspaceConfig = {
        name: name,
        path: path,
        // children: [],
        // variables: [],
        environments: { default: [] },
        // variables: [],
        cookieJar: [],
    };
    // environments: {"default": ZapVariables[], "user_defined": ZapVariables[]}
    return CREATE_WORKSPACE_CONFIG_CONTENT;
}

export function create_folder_config_content(name: string, path: string) {
    const CREATE_FOLDER_CONFIG_CONTENT: ZapFolderConfig = {
        name: name,
        path: path,
        type: "folder",
        // variables: [],
    };

    return CREATE_FOLDER_CONFIG_CONTENT;
}

export function create_file_config_content(name: string, path: string) {
    const CREATE_FILE_CONTENT: ZapFileConfig = {
        name: name,
        path: path,
        type: "file",
        content: {
            url: "",
            method: "GET",
            headers: DEFAULT_HEADERS,
            body: {
                type: "none",
                content: undefined,
            },
            params: [],
            auth: {
                type: "no-auth",
                config: undefined,
            },
            networkConfig: NETWORK_CONFIG,
        },
    };

    return CREATE_FILE_CONTENT;
}

export function create_readme_content(name: string) {
    return `## Welcome to Zap
    This is folder ${name}
  `;
}

export const DEFAULT_HEADERS: ZapHeaders[] = [
    {
        key: "Cache-Control",
        value: "no-cache",
        default: true,
        description: "Prevent the server from returning stale response.",
        enabled: true,
    },
    {
        key: "Content-Type",
        value: "application/json",
        default: true,
        description: "Type of content accepted by the request.",
        enabled: true,
    },
    {
        key: "Accept",
        value: "*/*",
        default: true,
        description:
            "Tell the server that Zap can process all forms of response and content-types.",
        enabled: true,
    },
    {
        key: "Accept-Encoding",
        value: "gzip, defalte, br",
        default: true,
        description:
            "Indicates the server that Zap client supports defined list of content encoding or compression algorithm as response.",
        enabled: true,
    },
    {
        key: "Connection",
        value: "keep-alive",
        default: true,
        description:
            "Indicates the server to keep the underlying connection open once the current response is recieved for faster processing of further requests.",
        enabled: true,
    },
];

export const NETWORK_CONFIG: ZapNetworkConfig = [
    {
        key: "httpVersion",
        type: "string",
        title: "HTTP Version",
        value: "1.1",
        default: "1.1",
        options: ["1.0", "1.1", "2.0", "auto"],
        description: "Select the HTTP version to use for sending the request.",
    },
    {
        key: "sslVerify",
        type: "boolean",
        title: "SSL Certificate Verification",
        value: false,
        default: false,
        description:
            "Verify SSL certificates when sending a request. Verification failures will result in the request being aborted.",
    },
    {
        key: "disabledProtocols",
        type: "string[]",
        title: "TLS/SSL protocols disabled during handshake",
        value: [],
        default: [],
        options: ["TLSv1.0", "TLSv1.1", "TLSv1.2", "TLSv1.3"],
        description:
            "Specify the SSL and TLS protocol versions to be disabled during handshake. All other protocols will be enabled.",
    },
    {
        key: "followRedirects",
        type: "boolean",
        title: "Automatically follow redirects",
        value: false,
        default: false,
        description: "Follow HTTP 3xx responses as redirects.",
    },
    {
        key: "maxRedirects",
        type: "number",
        title: "Maximum number of redirects",
        value: 10,
        default: 10,
        description: "Set a cap on the maximum number of redirects to follow.",
    },
    {
        key: "followOriginalHttpMethod",
        type: "boolean",
        title: "Follow original HTTP Method",
        value: false,
        default: false,
        description:
            "Redirect with the original HTTP method instead of the default behavior of redirecting with GET.",
    },
    {
        key: "followAuthHeader",
        type: "boolean",
        title: "Follow Authorization header",
        value: false,
        default: false,
        description:
            "Retain authorization header when a redirect happens to a different hostname.",
    },
    {
        key: "autoEncodeUrl",
        type: "boolean",
        title: "Encode URL automatically",
        value: true,
        default: true,
        description:
            "Encode the URL's path, query parameters, and authentication fields.",
    },
    {
        key: "disableCookieJar",
        type: "boolean",
        title: "Disable cookie jar",
        value: false,
        default: false,
        description:
            "Prevent cookies used in this request from being stored in the cookie jar. Existing cookies in the cookie jar will not be added as headers for this request.",
    },
    {
        key: "strictHttpParser",
        type: "boolean",
        title: "Enable strict HTTP parser",
        value: false,
        default: false,
        description: "Restrict responses with invalid HTTP headers.",
    },
];
