import { ZapAuth, ZapBody, ZapHeaders, ZapQueryParams } from "@/types/request";
import { create } from "zustand";
import { NETWORK_CONFIG } from "@/file-system/fs-data";
import { type ZapRequest } from "@/types/request";
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
    networkConfig: typeof NETWORK_CONFIG; // we can also do ZapNetworkConfig (type)
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
    setRequest: (request: ZapFileConfig, path: string) => void;
    markSaved: (path: string) => void;
}

export const useZapRequest = create<ZapRequestStore>()((set, get) => ({
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
                            queryParams: null,
                        } as ZapStoreRequest,
                    ],
                };
            }
        }),

    getRequest: (path) => {
        const request = get().requests.find((r) => r.path === path);
        return request;
    },

    setMethod: (path, method) =>
        set((state) => ({
            requests: state.requests.map((req) =>
                req.path === path ? { ...req, method, isSaved: false } : req,
            ),
        })),

    setAuth: (auth, path) =>
        set((state) => ({
            requests: state.requests.map((req) =>
                req.path === path ? { ...req, auth, isSaved: false } : req,
            ),
        })),

    setBody: (body, path) =>
        set((state) => ({
            requests: state.requests.map((req) =>
                req.path === path ? { ...req, body, isSaved: false } : req,
            ),
        })),

    setHeaders: (headers, path) =>
        set((state) => ({
            requests: state.requests.map((req) =>
                req.path === path ? { ...req, headers, isSaved: false } : req,
            ),
        })),

    setUrl: (url, path) =>
        set((state) => ({
            requests: state.requests.map((req) =>
                req.path === path ? { ...req, url, isSaved: false } : req,
            ),
        })),

    setQueryParams: (params, path) =>
        set((state) => {
            const updatedRequests = state.requests.map((req) =>
                req.path === path
                    ? { ...req, queryParams: params, isSaved: false }
                    : req,
            );

            return { ...state, requests: updatedRequests };
        }),

    setNetworkConfig: (key, value, path) =>
        set((state) => ({
            requests: state.requests.map((req) =>
                req.path === path
                    ? {
                          ...req,
                          networkConfig: req.networkConfig.map((config) =>
                              config.hasOwnProperty(key)
                                  ? { ...config, [key]: value }
                                  : config,
                          ),
                      }
                    : req,
            ),
        })),

    setRequest: (request, path) =>
        set((state) => ({
            requests: state.requests.map((req) =>
                req.path === path
                    ? {
                          ...req,
                          path: path,
                          name: path,
                          url: request.content.url,
                          method: request.content.method,
                          auth: request.content.auth,
                          headers: request.content.headers,
                          queryParams: request.content.params,
                          body: request.content.body,
                          networkConfig: request.content.networkConfig,
                          isSaved: true,
                      }
                    : req,
            ),
        })),

    markSaved: (path) =>
        set((state) => ({
            requests: state.requests.map((req) =>
                req.path === path ? { ...req, isSaved: true } : req,
            ),
        })),
}));
