import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { createSelectors } from "@/lib/zustand-selector";
import { ZapHttpMethods } from "@/types/request";

const MAX_OPEN_TABS = 10;

type Tab = {
    name: string;
    path: string;
    method?: ZapHttpMethods;
    content?: string;
};

interface TabsStore {
    activeTab?: Tab;
    tabs: Tab[];

    setActiveTab: (
        path: string,
        name: string,
        method?: ZapHttpMethods,
        content?: string,
    ) => void;
    addTab: (path: string, name: string, method?: ZapHttpMethods) => void;
    closeTab: (path: string) => void;
    renameTabPath: (oldPath: string, newPath: string, isDir: boolean) => void;
    updateTabPath: (oldPath: string, newPath: string) => void;
}

export const useTabsStore = createSelectors(
    create<TabsStore>()(
        immer((set) => ({
            activeTab: undefined,
            tabs: [],

            setActiveTab: (path, name, method, content) =>
                set((state) => {
                    const existing = state.tabs.find((t) => t.path === path);

                    if (!existing) {
                        if (state.tabs.length >= MAX_OPEN_TABS) {
                            state.tabs.shift();
                        }
                        const newTab = { name, path, method, content };
                        state.tabs.push(newTab);
                        state.activeTab = newTab;
                    } else {
                        existing.method = method;
                        state.activeTab = existing;
                    }
                }),

            addTab: (path, name, method) =>
                set((state) => {
                    const newTab: Tab = {
                        name,
                        path,
                        method,
                    };
                    if (state.tabs.length >= MAX_OPEN_TABS) {
                        state.tabs.shift();
                    }

                    state.tabs.push(newTab);
                    state.activeTab = newTab;
                }),

            closeTab: (path) =>
                set((state) => {
                    const index = state.tabs.findIndex((t) => t.path === path);
                    if (index === -1) return;

                    const wasActive = state.activeTab?.path === path;
                    state.tabs.splice(index, 1);

                    if (wasActive) {
                        if (state.tabs.length === 0) {
                            state.activeTab = undefined;
                        } else if (index > 0) {
                            state.activeTab = state.tabs[index - 1];
                        } else {
                            state.activeTab = state.tabs[0];
                        }
                    }
                }),

            updateTabPath: (oldPath, newPath) =>
                set((state) => {
                    state.tabs = state.tabs.map((tab) =>
                        tab.path === oldPath ? { ...tab, path: newPath } : tab,
                    );

                    if (state.activeTab?.path === oldPath) {
                        state.activeTab = {
                            ...state.activeTab,
                            path: newPath,
                        };
                    }
                }),

            renameTabPath: (oldPath: string, newName: string, isDir: boolean) =>
                set((state) => {
                    const parentPath = oldPath
                        .split("/")
                        .slice(0, -1)
                        .join("/");
                    const newPath = isDir
                        ? `${parentPath}/${newName}`
                        : `${parentPath}/${newName}.json`;

                    state.tabs = state.tabs.map((tab) => {
                        if (isDir) {
                            if (tab.path.startsWith(oldPath)) {
                                return {
                                    ...tab,
                                    path: tab.path.replace(oldPath, newPath),
                                };
                            }
                        } else {
                            if (tab.path === oldPath) {
                                return {
                                    ...tab,
                                    path: newPath,
                                    name: `${newName}.json`,
                                };
                            }
                        }
                        return tab;
                    });

                    if (state.activeTab) {
                        if (
                            (isDir &&
                                state.activeTab.path.startsWith(oldPath)) ||
                            (!isDir && state.activeTab.path === oldPath)
                        ) {
                            state.activeTab = {
                                ...state.activeTab,
                                path: isDir
                                    ? state.activeTab.path.replace(
                                          oldPath,
                                          newPath,
                                      )
                                    : newPath,
                                name: isDir
                                    ? state.activeTab.name
                                    : `${newName}.json`,
                            };
                        }
                    }
                }),
        })),
    ),
);
