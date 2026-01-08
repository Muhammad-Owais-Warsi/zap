import { createSelectors } from "@/lib/zustand-selector";
import { ZapWorkspaceConfig } from "@/types/fs";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CwdStore {
    workspaces: string[];
    workspace?: string;
    workspaceConfig?: ZapWorkspaceConfig;
    setWorkspace: (workspace: string) => void;
    setWorkspaces: (workspaces: string[]) => void;
    setWorkspaceConfig: (config: ZapWorkspaceConfig) => void;
}

export const useCwdStore = createSelectors(
    create<CwdStore>()(
        persist(
            (set) => ({
                workspaces: [],
                workspace: undefined,
                workspaceConfig: undefined,

                setWorkspace: (workspace) =>
                    set(() => ({
                        workspace,
                    })),

                setWorkspaceConfig: (workspaceConfig) =>
                    set(() => ({
                        workspaceConfig,
                    })),

                setWorkspaces: (workspaces) =>
                    set(() => ({
                        workspaces,
                    })),
            }),
            {
                name: "new-cwd-store",
            },
        ),
    ),
);
