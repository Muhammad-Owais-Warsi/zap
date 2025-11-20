import {
    ZapAuth,
    ZapBody,
    ZapBodyContent,
    ZapBodyType,
    ZapFormDataBodyType,
    ZapFormUrlEncodedBodyType,
    ZapHeaders,
    ZapQueryParams,
    ZapRawBodyTypeLanguage,
    // ZapRawBodyType,
} from "@/types/request";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { NETWORK_CONFIG } from "@/file-system/fs-data";
import { ZapFileConfig } from "@/types/fs";

// we are changing body:ZapBody coz on tab chnage the data is lost
// even on body type change, not a good experience and it will also make
// the further handling of body difficult like storing multiple types of body
// even though only one is sent.
//
// First Intention was to chnage it to body:ZapBody[] but I beleive this is not very optimized
// coz bodyType: raw is also nested with languages so storing that is difficult other than this
// form type fileds are array and not single key value
//
// but ervything was fine until few changes
// but another issue arises that is we can only store single bodytype in actual file so storing multiple headersis of
// no use, so we need to change the actual body type

// type RequestRawBodyType = {
//     current: ZapRawBodyType;
//     text: string;
//     json: string;
//     html: string;
//     xml: string;
//     javascript: string;
// };

// HERE CANT HANDLE RAW TYPE...CHECK THIS
export type ZapRequestBody = {
    current: ZapBodyType;
    language?: ZapRawBodyTypeLanguage;
    body: ZapBody;
};

export interface ZapStoreRequest {
    isSaved: boolean;
    name: string | null;
    path: string | null;
    url: string | null;
    method: string | "GET";
    auth: ZapAuth | null;
    body: ZapRequestBody | null;
    headers: ZapHeaders[] | null;
    queryParams: ZapQueryParams[] | null;
    networkConfig: typeof NETWORK_CONFIG;
}

interface ZapRequestStore {
    requests: ZapStoreRequest[];
    setPathAndName: (path: string, name: string) => void;
    getRequest: (path: string) => ZapStoreRequest | undefined;
    setAuth: (auth: ZapAuth, path: string) => void;
    setCurrentBody: (
        type: ZapBodyType,
        path: string,
        language?: ZapRawBodyTypeLanguage,
    ) => void;
    setBody: (
        type: ZapBodyType,
        path: string,
        body?: ZapBodyContent,
        language?: ZapRawBodyTypeLanguage,
    ) => void;
    setHeaders: (headers: ZapHeaders[], path: string) => void;
    setMethod: (method: string, path: string) => void;
    setUrl: (url: string, path: string) => void;
    setQueryParams: (params: ZapQueryParams[], path: string) => void;
    setNetworkConfig: (key: string, value: any, path: string) => void;
    setRequest: (
        request: ZapFileConfig | ZapStoreRequest,
        path: string,
    ) => void;
    markSaved: (path: string) => void;
}

const FALLBACK_BODY = {
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
};

export const useZapRequest = create<ZapRequestStore>()(
    persist(
        (set, get) => ({
            requests: [],

            setPathAndName: (path, name) =>
                set((state) => {
                    const exists = state.requests.some((r) => r.path === path);
                    if (exists) {
                        return {
                            requests: state.requests.map((r) =>
                                r.path === path ? { ...r, name } : r,
                            ),
                        };
                    } else {
                        return {
                            requests: [
                                ...state.requests,
                                {
                                    path,
                                    name,
                                    isSaved: true,
                                    url: null,
                                    method: "GET",
                                    auth: null,
                                    body: null,
                                    headers: null,
                                    queryParams: null,
                                    networkConfig: NETWORK_CONFIG,
                                } as ZapStoreRequest,
                            ],
                        };
                    }
                }),

            getRequest: (path) => get().requests.find((r) => r.path === path),

            setMethod: (method, path) =>
                set((state) => ({
                    requests: state.requests.map((req) =>
                        req.path === path
                            ? { ...req, method, isSaved: false }
                            : req,
                    ),
                })),

            setAuth: (auth, path) =>
                set((state) => ({
                    requests: state.requests.map((req) =>
                        req.path === path
                            ? { ...req, auth, isSaved: false }
                            : req,
                    ),
                })),

            setCurrentBody: (type, path, language) =>
                set((state) => ({
                    requests: state.requests.map((req) =>
                        req.path === path
                            ? {
                                  ...req,
                                  body: req.body
                                      ? {
                                            ...req.body,
                                            current: type,
                                            language: language,
                                        }
                                      : {
                                            current: type,
                                            language: language,
                                            body: FALLBACK_BODY as ZapBody,
                                        }, // fallback if body null
                                  isSaved: false,
                              }
                            : req,
                    ),
                })),

            setBody: (type, path, body, language) =>
                set((state) => ({
                    requests: state.requests.map((req) =>
                        req.path === path
                            ? {
                                  ...req,
                                  body: {
                                      // Handle case when req.body is null
                                      current: type,
                                      language: language,
                                      body: {
                                          // Spread existing body or use fallback
                                          ...(req.body?.body ?? FALLBACK_BODY),
                                          [type]:
                                              type === "raw" && language
                                                  ? {
                                                        // Ensure raw object exists before spreading
                                                        ...(req.body?.body
                                                            ?.raw ??
                                                            FALLBACK_BODY.raw),
                                                        [language]: body,
                                                    }
                                                  : body,
                                      },
                                  },
                                  isSaved: false,
                              }
                            : req,
                    ),
                })),

            setHeaders: (headers, path) =>
                set((state) => ({
                    requests: state.requests.map((req) =>
                        req.path === path
                            ? { ...req, headers, isSaved: false }
                            : req,
                    ),
                })),

            setUrl: (url, path) =>
                set((state) => ({
                    requests: state.requests.map((req) =>
                        req.path === path
                            ? { ...req, url, isSaved: false }
                            : req,
                    ),
                })),

            setQueryParams: (params, path) =>
                set((state) => ({
                    requests: state.requests.map((req) =>
                        req.path === path
                            ? { ...req, queryParams: params, isSaved: false }
                            : req,
                    ),
                })),

            setNetworkConfig: (key, value, path) =>
                set((state) => ({
                    requests: state.requests.map((req) =>
                        req.path === path
                            ? {
                                  ...req,
                                  networkConfig: req.networkConfig.map(
                                      (config) =>
                                          config.key === key
                                              ? { ...config, value }
                                              : config,
                                  ),
                              }
                            : req,
                    ),
                })),

            setRequest: (request, path) =>
                set((state) => {
                    const content = request?.content ?? request;
                    console.log("CONTENT", content);
                    return {
                        requests: state.requests.map((req) =>
                            req.path === path
                                ? {
                                      ...req,
                                      path,
                                      name: path,
                                      url: content.url ?? req.url,
                                      method: content.method ?? req.method,
                                      auth: content.auth ?? req.auth,
                                      headers: content.headers ?? req.headers,
                                      queryParams:
                                          content.params ??
                                          content.queryParams ??
                                          req.queryParams,
                                      body: content.body ?? req.body,
                                      networkConfig:
                                          content.networkConfig ??
                                          req.networkConfig ??
                                          NETWORK_CONFIG,
                                      isSaved: req.isSaved ?? true,
                                  }
                                : req,
                        ),
                    };
                }),

            markSaved: (path) =>
                set((state) => ({
                    requests: state.requests.map((req) =>
                        req.path === path ? { ...req, isSaved: true } : req,
                    ),
                })),
        }),
        {
            name: "zap-request-session",
            storage: createJSONStorage(() => sessionStorage),
        },
    ),
);

//TODO
// Check setPathAndname func , specially else acse why it is there???
