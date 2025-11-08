import { ZapAuth, ZapBody, ZapHeaders, ZapQueryParams } from "@/types/request";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { NETWORK_CONFIG } from "@/file-system/fs-data";
import { ZapFileConfig } from "@/types/fs";

interface ZapStoreRequest {
    isSaved: boolean;
    name: string | null;
    path: string | null;
    url: string | null;
    method: string | "GET";
    auth: ZapAuth | null;
    body: ZapBody | null;
    headers: ZapHeaders[] | null;
    queryParams: ZapQueryParams[] | null;
    networkConfig: typeof NETWORK_CONFIG;
}

interface ZapRequestStore {
    requests: ZapStoreRequest[];
    setPathAndName: (path: string, name: string) => void;
    getRequest: (path: string) => ZapStoreRequest | undefined;
    setAuth: (auth: ZapAuth, path: string) => void;
    setBody: (body: ZapBody, path: string) => void;
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

            setBody: (body, path) =>
                set((state) => ({
                    requests: state.requests.map((req) =>
                        req.path === path
                            ? { ...req, body, isSaved: false }
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
