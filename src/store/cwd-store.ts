import { ZapWorkspaceConfig } from "@/types/fs";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CwdStore {
    workspaces: string[];
    name: string | null;
    workspaceConfig: ZapWorkspaceConfig | null;
    selectedFile: {
        path: string;
        content: string;
    } | null;
    setWorkspaces: (workspace: string[]) => void;
    workspaceUpdateTrigger: number;
    setSelectedFile: (path: string | null, content: string | null) => void;
    setWorkspaceConfig: (content: ZapWorkspaceConfig) => void;
    updateName: (name: string) => void;
    resetCwdStore: () => void;
    triggerWorkspaceUpdate: () => void;
}

export const useCwdStore = create<CwdStore>()(
    persist(
        (set) => ({
            workspaces: [],
            name: null,
            workspaceConfig: null,
            selectedFile: null,
            workspaceUpdateTrigger: 0,

            setWorkspaces: (workspace) => set({ workspaces: workspace }),

            updateName: (name) => set({ name }),

            setWorkspaceConfig: (content) => set({ workspaceConfig: content }),

            setSelectedFile: (path, content) =>
                set((state) => {
                    if (!path && !content) return { selectedFile: null };

                    return {
                        selectedFile: {
                            path: path,
                            content: content,
                        },
                    };
                }),

            resetCwdStore: () =>
                set({
                    name: null,
                    selectedFile: null,
                    workspaceUpdateTrigger: 0,
                }),

            triggerWorkspaceUpdate: () =>
                set((state) => ({
                    workspaceUpdateTrigger: state.workspaceUpdateTrigger + 1,
                })),
        }),
        {
            name: "cwd-store",
        },
    ),
);
