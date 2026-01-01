import {
    mkdir,
    writeTextFile,
    BaseDirectory,
    exists,
    readTextFile,
    rename,
    remove,
} from "@tauri-apps/plugin-fs";
import { readDir } from "@tauri-apps/plugin-fs";
import {
    create_file_config_content,
    create_folder_config_content,
    create_readme_content,
    create_workspcae_config_content,
} from "./fs-data";
import { WorkspaceEntry } from "@/types/fs";
import { invoke } from "@tauri-apps/api/core";

const BASE_DIR = BaseDirectory.AppData;

async function getWorkspace() {
    const entries = await readDir("./", { baseDir: BASE_DIR });

    const folders = entries
        .filter((entry) => entry.isDirectory)
        .map((entry) => entry.name)
        .filter(Boolean) as string[];

    return folders;
}

async function getWorkspaceRecursively(
    name: string,
): Promise<WorkspaceEntry[]> {
    // const entries = await readDir(name, { baseDir: BASE_DIR });
    // // Use Promise.all to fetch all entries in a directory simultaneously (much faster)
    // const result = await Promise.all(
    //     entries.map(async (entry) => {
    //         const entryName = entry.name!;
    //         const isDir = entry.isDirectory;
    //         const fullPath = name ? `${name}/${entryName}` : entryName;
    //         const workspaceEntry: WorkspaceEntry = {
    //             name: entryName,
    //             path: fullPath,
    //             content: "",
    //             isDirectory: isDir,
    //         };
    //         if (isDir) {
    //             // Recurse into subdirectories
    //             workspaceEntry.children =
    //                 await getWorkspaceRecursively(fullPath);
    //         } else {
    //             // --- Logic for Files ---
    //             try {
    //                 // Only attempt to read if it's a file we expect to be JSON
    //                 // You can add a check here: if (entryName.endsWith('.json'))
    //                 const content = await getFileContent(fullPath);
    //                 if (content && content.trim()) {
    //                     const parsedContent = JSON.parse(content);
    //                     // Safely access the method (using optional chaining)
    //                     workspaceEntry.content = content;
    //                     workspaceEntry.method =
    //                         parsedContent?.content?.method || "GET";
    //                 } else {
    //                     workspaceEntry.method = "GET";
    //                 }
    //             } catch (error) {
    //                 // If JSON is invalid or file is unreadable, default to GET
    //                 // and don't let the whole process crash
    //                 console.error(`Error parsing file ${entryName}:`, error);
    //                 workspaceEntry.method = "GET";
    //             }
    //         }
    //         return workspaceEntry;
    //     }),
    // );
    // console.log("Workspace Refreshed:", result);
    // return result;
    //
    const result = await invoke("read_workspace_recursive", {
        workspace: name,
    });
    console.log(result);
    return result as WorkspaceEntry[];
}

async function getFileContent(path: string) {
    if (!(await exists(path, { baseDir: BASE_DIR }))) {
        throw Error("File not exist");
    }

    const content = await readTextFile(path, { baseDir: BASE_DIR });
    console.log(content);

    return content;
}

async function createWorkspace(name: string) {
    if (await exists(name, { baseDir: BASE_DIR })) {
        throw Error("Workspace already exist");
    }

    const path = `${name}`;
    await mkdir(name, { recursive: true, baseDir: BASE_DIR });
    await writeTextFile(
        `${name}/workspace_config.json`,
        JSON.stringify(create_workspcae_config_content(name, path)),
        { baseDir: BASE_DIR },
    );
}

async function createDirectory(name: string, path: string) {
    const folderPath = `${path}/${name}`;

    if (await exists(folderPath, { baseDir: BASE_DIR })) {
        throw Error("Folder already exist");
    }

    await mkdir(folderPath, { recursive: true, baseDir: BASE_DIR });
    await writeTextFile(
        `${folderPath}/folder_config.json`,
        JSON.stringify(create_folder_config_content(name, folderPath)),
        { baseDir: BASE_DIR },
    );
    await writeTextFile(
        `${folderPath}/README.md`,
        JSON.stringify(create_readme_content(name)),
        { baseDir: BASE_DIR },
    );
}

async function createFile(name: string, path: string) {
    const filePath = `${path}/${name}`;

    if (await exists(filePath, { baseDir: BASE_DIR })) {
        throw Error("File already exist");
    }

    await writeTextFile(
        `${filePath}.json`,
        JSON.stringify(create_file_config_content(name, filePath)),
        {
            baseDir: BASE_DIR,
        },
    );
}

async function moveFile(
    source: { path: string; isDir: boolean; name: string },
    target: string,
) {
    if (source.isDir) {
        throw new Error("Source cannot be a directory");
    }

    await rename(source.path, target + `/${source.name}`, {
        newPathBaseDir: BASE_DIR,
        oldPathBaseDir: BASE_DIR,
    });
}

async function renameFile(path: string, newName: string) {
    if (!newName.endsWith(".json")) {
        newName = `${newName}.json`;
    }
    const dir = path.split("/").slice(0, -1).join("/");
    const newPath = `${dir}/${newName}`;

    await rename(path, newPath, {
        newPathBaseDir: BASE_DIR,
        oldPathBaseDir: BASE_DIR,
    });
}

async function renameFolder(path: string, newName: string) {
    if (newName.endsWith(".json")) {
        newName = newName.replace(/\.json$/, "");
    }
    const dir = path.split("/").slice(0, -1).join("/");
    const newPath = `${dir}/${newName}`;

    await rename(path, newPath, {
        newPathBaseDir: BASE_DIR,
        oldPathBaseDir: BASE_DIR,
    });
}

async function removeFileOrDir(path: string) {
    if (!(await exists(path, { baseDir: BASE_DIR }))) {
        throw Error("Not exist");
    }

    await remove(path, { baseDir: BASE_DIR, recursive: true });
}

async function writeFile(path: string, content: any) {
    const stringified_content = JSON.stringify(content);

    await writeTextFile(path, stringified_content, { baseDir: BASE_DIR });
}

export {
    createWorkspace,
    createDirectory,
    createFile,
    getWorkspace,
    getWorkspaceRecursively,
    getFileContent,
    moveFile,
    renameFile,
    renameFolder,
    writeFile,
    removeFileOrDir,
};
