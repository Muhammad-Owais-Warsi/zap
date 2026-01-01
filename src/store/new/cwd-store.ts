import { createSelectors } from "@/lib/zustand-selector";
import { ZapWorkspaceConfig } from "@/types/fs";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CwdStore {
    workspace?: string;
    workspaceConfig?: ZapWorkspaceConfig;
    setWorkspace: (workspace: string) => void;
    setWorkspaceConfig: (config: ZapWorkspaceConfig) => void;
}

export const useCwdStore = createSelectors(
    create<CwdStore>()(
        persist(
            (set) => ({
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
            }),
            {
                name: "new-cwd-store",
            },
        ),
    ),
);
