import { createSelectors } from "@/lib/zustand-selector";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface VariableStore {
    current: string;
    environment: string;
    scope: "workspace" | "folder";
    setCurrent: (environment: string) => void;
    setEnvironment: (environment: string) => void;
    setScope: (scope: "workspace" | "folder") => void;
}

export const useVariableStore = createSelectors(
    create<VariableStore>()(
        immer((set) => ({
            current: "default",
            environment: "default",
            scope: "workspace",

            setCurrent: (environment) =>
                set((state) => {
                    state.current = environment;
                }),

            setEnvironment: (environment) =>
                set((state) => {
                    state.environment = environment;
                }),

            setScope: (scope) =>
                set((state) => {
                    state.scope = scope;
                }),
        })),
    ),
);
