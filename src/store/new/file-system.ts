import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { createSelectors } from "@/lib/zustand-selector";
import { entriesType } from "@/hooks/useWorkspace";
import { addFileToTree } from "@/lib/fs/add-file-to-tree";
import { removeFileFromTree } from "@/lib/fs/remove-file-from-tree";
import { getFileByPath } from "@/lib/fs/get-file-by-path";
import { renameEntryInTree } from "@/lib/fs/fs-rename";
import { ZapHttpMethods } from "@/types/request";

interface FileSystemStore {
    files: entriesType[];
    activeFile?: string;

    setAllFiles: (entries: entriesType[]) => void;
    setActiveFile: (path?: string) => void;

    createFile: (name: string, parentPath: string) => void;
    moveFile: (oldPath: string, newPath: string) => void;
    getFile: (path: string) => void;
    updateMethod: (path: string, method: ZapHttpMethods) => void;
    renameFileOrFolder: (oldPath: string, newName: string) => void;
    deleteFile: (path: string) => void;
    createFolder: (name: string, parentPath: string) => void;
    deleteFolder: (path: string) => void;
}

export const useFileSystemStore = createSelectors(
    create<FileSystemStore>()(
        immer((set, get) => ({
            files: [],
            activeFile: undefined,

            setAllFiles: (entries) =>
                set((state) => {
                    state.files = entries;
                }),

            setActiveFile: (path) =>
                set((state) => {
                    state.activeFile = path;
                }),

            createFile: (name, parentPath) =>
                set((state) => {
                    const newEntry: entriesType = {
                        name: `${name}.json`,
                        path: `${parentPath}/${name}.json`,
                        is_dir: false,
                        method: "GET",
                        items: undefined,
                    };

                    const updatedFiles = addFileToTree(
                        state.files,
                        parentPath,
                        newEntry,
                    );
                    console.log("updated", updatedFiles);
                    // If no change, assume parent is root, add directly
                    if (updatedFiles === state.files) {
                        console.log("no change");
                        state.files = [...state.files, newEntry];
                    } else {
                        state.files = updatedFiles;
                    }

                    state.activeFile = newEntry.path;
                }),

            getFile: (path) => {
                return getFileByPath(get().files, path);
            },

            updateMethod: (path, method) =>
                set((state) => {
                    const file = getFileByPath(state.files, path);
                    if (file) {
                        file.method = method;
                    }
                }),

            moveFile: (oldPath, newPath) =>
                set((state) => {
                    const file = getFileByPath(state.files, oldPath);
                    if (!file) return;

                    state.files = removeFileFromTree(state.files, oldPath);
                    const targetPath = `${newPath}/${file.name}`;
                    const updatedFilePath = { ...file, path: targetPath };
                    const updatedFiles = addFileToTree(
                        state.files,
                        newPath,
                        updatedFilePath,
                    );

                    if (updatedFiles === state.files) {
                        console.log("no change");
                        state.files = [...state.files, updatedFilePath];
                    } else {
                        state.files = updatedFiles;
                    }

                    if (state.activeFile === oldPath) {
                        state.activeFile = targetPath;
                    }
                }),

            deleteFile: (path) =>
                set((state) => {
                    state.files = removeFileFromTree(state.files, path);
                    if (state.activeFile === path) {
                        state.activeFile = undefined;
                    }
                }),

            renameFileOrFolder: (oldPath, newName) =>
                set((state) => {
                    state.files = renameEntryInTree(
                        state.files,
                        oldPath,
                        newName,
                    );
                    const parentPath = oldPath
                        .split("/")
                        .slice(0, -1)
                        .join("/");

                    const isFile = !oldPath.endsWith("/");
                    const newPath = isFile
                        ? `${parentPath}/${newName}.json`
                        : `${parentPath}/${newName}`;
                    if (
                        state.activeFile &&
                        state.activeFile.startsWith(oldPath)
                    ) {
                        state.activeFile = state.activeFile.replace(
                            oldPath,
                            newPath,
                        );
                    }
                }),

            createFolder: (name, parentPath) =>
                set((state) => {
                    const folderPath = `${parentPath}/${name}`;

                    const readmeEntry: entriesType = {
                        name: "README.md",
                        path: `${folderPath}/README.md`,
                        is_dir: false,
                        items: undefined,
                    };

                    const newFolder: entriesType = {
                        name,
                        path: folderPath,
                        is_dir: true,
                        items: [readmeEntry],
                    };

                    const updatedFiles = addFileToTree(
                        state.files,
                        parentPath,
                        newFolder,
                    );

                    if (updatedFiles === state.files) {
                        console.log("no change");
                        state.files = [...state.files, newFolder];
                    } else {
                        state.files = updatedFiles;
                    }

                    state.activeFile = readmeEntry.path;
                }),

            deleteFolder: (path) =>
                set((state) => {
                    state.files = removeFileFromTree(state.files, path);
                    if (state.activeFile?.startsWith(path)) {
                        state.activeFile = undefined;
                    }
                }),
        })),
    ),
);
