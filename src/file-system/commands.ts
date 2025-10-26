import {
    mkdir,
    writeTextFile,
    BaseDirectory,
    exists,
    readTextFile,
    rename,
} from "@tauri-apps/plugin-fs";
import { readDir } from "@tauri-apps/plugin-fs";
import {
    create_file_config_content,
    create_folder_config_content,
    create_readme_content,
    create_workspcae_config_content,
} from "./fs-data";
import { WorkspaceEntry } from "@/types/fs";

const BASE_DIR = BaseDirectory.AppData;

async function getWorkspace() {
    const entries = await readDir("./", { baseDir: BASE_DIR });
    // console.log("Entries:", entries);

    const folders = entries
        .filter((entry) => entry.isDirectory)
        .map((entry) => entry.name)
        .filter(Boolean) as string[];

    return folders;
}

async function getWorkspaceRecursively(name: string) {
    const entries = await readDir(name, { baseDir: BASE_DIR });
    const result: WorkspaceEntry[] = [];

    for (const entry of entries) {
        const isDir = entry.isDirectory;
        const fullPath = name ? `${name}/${entry.name!}` : entry.name!;
        const workspaceEntry: WorkspaceEntry = {
            name: entry.name!,
            path: fullPath,
            isDirectory: isDir,
        };

        if (isDir) {
            workspaceEntry.children = await getWorkspaceRecursively(fullPath);
        }

        result.push(workspaceEntry);
    }
    console.log(result);
    return result;
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
    if (source.path === target) return;

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
};
