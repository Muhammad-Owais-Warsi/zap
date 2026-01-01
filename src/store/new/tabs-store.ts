import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { createSelectors } from "@/lib/zustand-selector";
import { ZapHttpMethods } from "@/types/request";

type Tab = {
    name: string;
    path: string;
    method?: ZapHttpMethods;
};

interface TabsStore {
    activeTab?: Tab;
    tabs: Tab[];

    setActiveTab: (path: string, name: string, method?: ZapHttpMethods) => void;
    addTab: (path: string, name: string, method?: ZapHttpMethods) => void;
    closeTab: (path: string) => void;
    updateTabPath: (oldPath: string, newPath: string) => void;
}

export const useTabsStore = createSelectors(
    create<TabsStore>()(
        immer((set) => ({
            activeTab: undefined,
            tabs: [],

            setActiveTab: (path, name, method) =>
                set((state) => {
                    const existing = state.tabs.find((t) => t.path === path);

                    if (!existing) {
                        const newTab = { name, path, method };
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
        })),
    ),
);
