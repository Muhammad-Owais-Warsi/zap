import { create } from "zustand";
import { persist } from "zustand/middleware";

export type TabInfo = {
    name: string;
    path: string;
};

interface Tabs {
    activeTab: TabInfo | null;
    tabs: TabInfo[];
    setActiveTab: (tab: TabInfo | null) => void;
    addNewTab: (tab: TabInfo) => void;
    closeTab: (path: string) => void;
    resetTabStore: () => void;
}

export const useTabsStore = create<Tabs>()(
    persist(
        (set) => ({
            activeTab: null,
            tabs: [],

            setActiveTab: (tab) =>
                set((state) => {
                    if (!tab) return { activeTab: null, tabs: state.tabs };
                    const exists = state.tabs.some((t) => t.path === tab.path);
                    const updatedTabs = exists
                        ? state.tabs
                        : [...state.tabs, tab];

                    return { activeTab: tab, tabs: updatedTabs };
                }),

            addNewTab: (tab) =>
                set((state) => {
                    const updatedTabs = [...state.tabs, tab];
                    return { activeTab: tab, tabs: updatedTabs };
                }),

            closeTab: (path) =>
                set((state) => {
                    const updatedTabs = state.tabs.filter(
                        (t) => t.path !== path,
                    );
                    const wasActive = state.activeTab?.path === path;

                    return {
                        tabs: updatedTabs,
                        activeTab: wasActive
                            ? updatedTabs[updatedTabs.length - 1] || null
                            : state.activeTab,
                    };
                }),
            resetTabStore: () =>
                set({
                    activeTab: null,
                    tabs: [],
                }),
        }),
        {
            name: "tabs-storage",
        },
    ),
);
