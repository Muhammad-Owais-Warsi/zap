import { create } from "zustand";

interface ZapRequest {
    isSaved: boolean;
    name: string | null;
    path: string | null;
    url: string | null;
    method: string | "GET";
    queryParams: Record<string, string>[] | null;
}
interface ZapRequestStore {
    requests: ZapRequest[];
    setPathAndName: (path: string, name: string) => void;
    getRequest: (path: string) => ZapRequest | undefined;
    setMethod: (method: string, path: string) => void;
    setUrl: (url: string, path: string) => void;
    setQueryParams: (params: Record<string, string>[], path: string) => void;
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
                        } as ZapRequest,
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

    markSaved: (path) =>
        set((state) => ({
            requests: state.requests.map((req) =>
                req.path === path ? { ...req, isSaved: true } : req,
            ),
        })),
}));
