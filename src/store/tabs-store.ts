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
    isDirty?: boolean;
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
    addTab: (
        path: string,
        name: string,
        method?: ZapHttpMethods,
        content?: string,
    ) => void;
    checkExist: (path: string) => boolean;
    closeTab: (path: string) => void;
    renameTabPath: (oldPath: string, newPath: string, isDir: boolean) => void;
    updateTabPath: (oldPath: string, newPath: string) => void;
    updateTabMethod: (path: string, mathod: ZapHttpMethods) => void;
    updateTabContent: (path: string, content: string) => void;
    updateIsDirty: (path: string, isDirty: boolean) => void;
    resetTabs: () => void;
}

export const useTabsStore = createSelectors(
    create<TabsStore>()(
        immer((set, get) => ({
            activeTab: undefined,
            tabs: [],

            setActiveTab: (path, name, method, content) =>
                set((state) => {
                    const existing = state.tabs.find((t) => t.path === path);
                    console.log(existing);
                    if (!existing) {
                        if (state.tabs.length >= MAX_OPEN_TABS) {
                            state.tabs.shift();
                        }
                        const newTab = { name, path, method, content };
                        state.tabs.push(newTab);
                        state.activeTab = newTab;
                    } else {
                        console.log("found existing");
                        existing.method = method;
                        state.activeTab = existing;
                    }
                }),

            checkExist: (path) => {
                return get().tabs.some((tab) => tab.path === path);
            },

            addTab: (path, name, method, content) =>
                set((state) => {
                    const newTab: Tab = {
                        name,
                        path,
                        method,
                        content,
                        isDirty: false,
                    };
                    if (state.tabs.length >= MAX_OPEN_TABS) {
                        state.tabs.shift();
                    }

                    state.tabs.push(newTab);
                    state.activeTab = newTab;
                }),

            closeTab: (path) =>
                set((state) => {
                    const toClose = state.tabs
                        .filter(
                            (t) =>
                                t.path === path ||
                                t.path.startsWith(path + "/"),
                        )
                        .map((t) => t.path);

                    state.tabs = state.tabs.filter(
                        (t) => !toClose.includes(t.path),
                    );

                    if (
                        state.activeTab &&
                        toClose.includes(state.activeTab.path)
                    ) {
                        if (state.tabs.length === 0) {
                            state.activeTab = undefined;
                        } else {
                            state.activeTab = state.tabs[state.tabs.length - 1];
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

            updateTabMethod: (path, method) =>
                set((state) => {
                    const tab = state.tabs.find((t) => t.path === path);
                    if (tab) {
                        tab.method = method;
                        tab.isDirty = true;
                    }
                    if (state.activeTab?.path === path) {
                        state.activeTab.method = method;
                        state.activeTab.isDirty = true;
                    }
                }),

            updateTabContent: (path, content) =>
                set((state) => {
                    const tab = state.tabs.find((t) => t.path === path);
                    if (tab) {
                        tab.content = content;
                        tab.isDirty = true;
                    }
                    if (state.activeTab?.path === path) {
                        state.activeTab.content = content;
                        state.activeTab.isDirty = true;
                    }
                }),

            updateIsDirty: (path, isDirty) =>
                set((state) => {
                    const tab = state.tabs.find((t) => t.path === path);
                    if (tab) {
                        tab.isDirty = isDirty;
                    }
                    if (state.activeTab?.path === path)
                        state.activeTab.isDirty = isDirty;
                }),

            resetTabs: () =>
                set((state) => {
                    state.tabs = [];
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
