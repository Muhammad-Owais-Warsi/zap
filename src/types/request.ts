export type ZapHttpMethods =
    | "GET"
    | "POST"
    | "PUT"
    | "PATCH"
    | "DELETE"
    | "HEAD"
    | "OPTIONS";

export type ZapBodyType =
    | "none"
    | "raw"
    | "form-data"
    | "x-www-form-urlencoded";

export type ZapAuthType = "no-auth" | "basic" | "bearer" | "api-key";

export type ZapAuth = {
    type: ZapAuthType;
    config?: ZapAuthConfig;
};

export type ZapAuthConfig = ZapBasicAuth | ZapBearerAuth | ZapApiKeyAuth;

export type ZapBasicAuth = {
    username: string;
    password: string;
};

export type ZapBearerAuth = {
    token: string;
};

export type ZapApiKeyAuth = {
    key: string;
    value: string;
    in: "header" | "param";
};

export type ZapBody = {
    none: null;
    "form-data": ZapFormDataBodyType[];
    "x-www-form-urlencoded": ZapFormUrlEncodedBodyType[];
    raw: Record<ZapRawBodyTypeLanguage, string>;
};

// export type ZapBody = {
//     type: ZapBodyType;
//     content: ZapBodyContent | null;
// };

export type ZapBodyContent =
    | string
    | ZapFormDataBodyType[]
    | ZapFormUrlEncodedBodyType[]
    | null;

export type ZapRawBodyTypeLanguage =
    | "text"
    | "json"
    | "html"
    | "javascript"
    | "xml";

// export type ZapRawBodyType = {
//     language: ZapRawBodyTypeLanguage;
//     text: string;
// };

export type ZapFormDataBodyType = {
    key: string;
    value: string | File;
    type: "text" | "file";
    description: string;
    enabled?: boolean;
};

export type ZapFormUrlEncodedBodyType = {
    key: string;
    value: string;
    description: string;
    enabled?: boolean;
};

// this the content that'll exist in a request/file
// here cookie jar is not there because its already there at the worksapce level
export type ZapRequest = {
    url: string;
    method: ZapHttpMethods;
    headers: ZapHeaders[];
    body: ZapBody;
    params: ZapQueryParams[];
    auth: ZapAuth;
    networkConfig: ZapNetworkConfig;
    // variables?: ZapVariables[];
};

export type ZapHeaders = {
    key: string;
    value: string;
    default: boolean;
    description: string;
    enabled?: boolean;
};

export type ZapVariables = {
    key: string;
    value: string;
    rootId?: string;
    scope: "workspace" | "folder";
};

export type ZapEnvironment = Record<string, ZapVariables[]>;

export type ZapCookie = {
    key: string;
    value: string;
    domain: string;
    path: string;
    expires?: string;
    secure?: boolean;
    httpOnly?: boolean;
    sameSite?: "Lax" | "Strict" | "None";
};

export type ZapQueryParams = {
    key: string;
    value: string;
    enabled?: boolean;
};

export type ZapNetworkConfigItem<T> = {
    key: string;
    type: "string" | "boolean" | "number" | "string[]";
    title: string;
    value: T;
    default: T;
    options?: string[];
    description: string;
};

export type ZapNetworkConfig = ZapNetworkConfigItem<any>[];

// export type ZapNetworkConfig = [
//     {
//         key: "httpVersion";
//         type: string;
//         title: "HTTP Version";
//         value: "1.0" | "1.1" | "2.0" | "auto";
//         default: "1.0";
//         description: "Select the HTTP version to use for sending the request.";
//     },
//     {
//         key: "sslVerify";
//         type: boolean;
//         title: "SSL Certificate Verification";
//         value: true | false;
//         default: false;
//         description: "Verify SSL certificates when sending a request. Verification failures will result in the request being aborted.";
//     },
//     {
//         key: "disabledProtocols";
//         type: string[];
//         title: "TLS/SSL protocols disabled during handshake";
//         value: "TLSv1.0" | "TLSv1.1" | "TLSv1.2" | "TLSv1.3";
//         default: [];
//         description: "Specify the SSL and TLS protocol versions to be disabled during handshake. All other protocols will be enabled.";
//     },
//     {
//         key: "followRedirects";
//         type: boolean;
//         title: "Automatically follow redirects";
//         value: true | false;
//         default: false;
//         description: "Follow HTTP 3xx responses as redirects.";
//     },
//     {
//         key: "maxRedirects";
//         type: number;
//         title: "Maximum number of redirects";
//         value: null;
//         default: 10;
//         description: "Set a cap on the maximum number of redirects to follow.";
//     },
//     {
//         key: "followOriginalHttpMethod";
//         type: boolean;
//         title: "Follow original HTTP Method";
//         value: true | false;
//         default: false;
//         description: "Redirect with the original HTTP method instead of the default behavior of redirecting with GET.";
//     },
//     {
//         key: "followAuthHeader";
//         type: boolean;
//         title: "Follow Authorization header";
//         value: true | false;
//         default: false;
//         description: "Retain authorization header when a redirect happens to a different hostname.";
//     },
//     {
//         key: "autoEncodeUrl";
//         type: boolean;
//         title: "Encode URL automatically";
//         value: true | false;
//         default: true;
//         description: "Encode the URL's path, query parameters, and authentication fields.";
//     },
//     {
//         key: "disableCookieJar";
//         type: boolean;
//         title: "Disable cookie jar";
//         value: true | false;
//         default: false;
//         description: "Prevent cookies used in this request from being stored in the cookie jar. Existing cookies in the cookie jar will not be added as headers for this request.";
//     },
//     {
//         key: "strictHttpParser";
//         type: boolean;
//         title: "Enable strict HTTP parser";
//         value: true | false;
//         default: false;
//         description: "Restrict responses with invalid HTTP headers.";
//     },
// ];
