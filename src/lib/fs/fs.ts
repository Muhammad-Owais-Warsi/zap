import { getZapFileContent } from "@/file-system/fs-operation";
import { useFileSystemStore } from "@/store/file-system";
import { useTabsStore } from "@/store/tabs-store";
import { ZapHttpMethods } from "@/types/request";

export const FileSystemOperations = {
    createFileAndOpenTab(parentPath: string, name: string) {
        const fs = useFileSystemStore.getState();
        const tabs = useTabsStore.getState();

        fs.createFile(name, parentPath);
        tabs.addTab(`${parentPath}/${name}.json`, `${name}.json`, "GET");
    },
    createFolderAndOpenTab(parentPath: string, name: string, content: string) {
        const fs = useFileSystemStore.getState();
        const tabs = useTabsStore.getState();

        fs.createFolder(name, parentPath);
        tabs.addTab(
            `${parentPath}/${name}/README.md`,
            "README.md",
            undefined,
            content,
        );
    },
    clickTabAndSetActiveFile(
        path: string,
        name: string,
        method?: ZapHttpMethods,
    ) {
        const fs = useFileSystemStore.getState();
        const tabs = useTabsStore.getState();

        fs.setActiveFile(path);
        tabs.setActiveTab(path, name, method);
    },
    closeTabAndSetActiveFile(path: string) {
        const tabsStore = useTabsStore.getState();
        const fsStore = useFileSystemStore.getState();
        tabsStore.closeTab(path);
        const freshTabsState = useTabsStore.getState();
        const newActiveTab = freshTabsState.activeTab;

        if (newActiveTab) {
            fsStore.setActiveFile(newActiveTab.path);
        } else {
            fsStore.setActiveFile(undefined);
        }
    },
    deleteFileAndCloseTab(path: string) {
        const fs = useFileSystemStore.getState();
        const tabs = useTabsStore.getState();

        tabs.closeTab(path);
        fs.deleteFile(path);
    },
    deleteFolderAndCloseTab(path: string) {
        const fs = useFileSystemStore.getState();
        const tabs = useTabsStore.getState();

        tabs.closeTab(path);
        fs.deleteFolder(path);
    },
    moveFileAndUpdateTab(oldPath: string, newPath: string) {
        const fs = useFileSystemStore.getState();
        const tabs = useTabsStore.getState();

        tabs.updateTabPath(oldPath, newPath);
        fs.moveFile(oldPath, newPath);
    },
    renameFileOrFolderAndHandleTabPath(
        oldPath: string,
        newName: string,
        isDir: boolean,
    ) {
        const fs = useFileSystemStore.getState();
        const tabs = useTabsStore.getState();

        tabs.renameTabPath(oldPath, newName, isDir);
        fs.renameFileOrFolder(oldPath, newName);
    },
    async selectFileAndHandleTab(
        path: string,
        name: string,
        method?: ZapHttpMethods,
    ) {
        const fs = useFileSystemStore.getState();
        const tabs = useTabsStore.getState();

        if (!tabs.checkExist(path)) {
            const content = await getZapFileContent(path);
            fs.setActiveFile(path);
            if (content.type === "success") {
                tabs.setActiveTab(path, name, method, content.message);
            }
        } else {
            fs.setActiveFile(path);
            tabs.setActiveTab(path, name, method);
        }
    },
    async selectFolderAndHandleTab(path: string) {
        const fs = useFileSystemStore.getState();
        const tabs = useTabsStore.getState();

        if (!tabs.checkExist(path)) {
            console.log("content fetched");
            const content = await getZapFileContent(path);
            fs.setActiveFile(path);
            if (content.type === "success") {
                tabs.setActiveTab(
                    path,
                    "README.md",
                    undefined,
                    content.message,
                );
            }
        } else {
            fs.setActiveFile(path);
            tabs.setActiveTab(path, "README.md");
        }
    },
    updateFileAndTabMethod(path: string, method: ZapHttpMethods) {
        const fs = useFileSystemStore.getState();
        const tabs = useTabsStore.getState();

        fs.updateMethod(path, method);
        tabs.updateTabMethod(path, method);
    },
};
