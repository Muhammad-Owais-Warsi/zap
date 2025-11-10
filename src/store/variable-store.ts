import { create } from "zustand";

interface VariableStore {
    environment: string;
    scope: "workspace" | "folder";
    setEnvironment: (environment: string) => void;
    setScope: (scope: "workspace" | "folder") => void;
}

export const useVariableStore = create<VariableStore>()((set) => ({
    environment: "default",
    scope: "workspace",

    setEnvironment: (environment) => set({ environment }),

    setScope: (scope) => set({ scope }),
}));
