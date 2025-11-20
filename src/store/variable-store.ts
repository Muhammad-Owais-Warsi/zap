import { create } from "zustand";

interface VariableStore {
    current: string;
    environment: string;
    scope: "workspace" | "folder";
    setCurrent: (environment: string) => void;
    setEnvironment: (environment: string) => void;
    setScope: (scope: "workspace" | "folder") => void;
}

export const useVariableStore = create<VariableStore>()((set) => ({
    current: "default",
    environment: "default",
    scope: "workspace",

    setCurrent: (environment) => set({ current: environment }),

    setEnvironment: (environment) => set({ environment }),

    setScope: (scope) => set({ scope }),
}));
