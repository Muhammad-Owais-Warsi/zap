import { ZapApiResponse } from "@/types/api";
import {
    createDirectory,
    createFile,
    createWorkspace,
    getFileContent,
    getWorkspace,
    getWorkspaceRecursively,
    moveFile,
    renameFile,
    renameFolder,
    writeFile,
} from "./commands";

export async function createZapRequest(
    name: string,
    path: string,
): Promise<ZapApiResponse> {
    try {
        await createFile(name, path);
        return {
            type: "success",
            message: "Zap request created successfully",
        };
    } catch (error: any) {
        return {
            type: "error",
            message: error.message,
        };
    }
}

export async function createZapWorkspace(
    name: string,
): Promise<ZapApiResponse> {
    try {
        await createWorkspace(name);
        return {
            type: "success",
            message: "Zap workspace created successfully",
        };
    } catch (error: any) {
        return {
            type: "error",
            message: error.message,
        };
    }
}

export async function createZapFolder(
    name: string,
    path: string,
): Promise<ZapApiResponse> {
    try {
        await createDirectory(name, path);
        return {
            type: "success",
            message: "Zap folder created successfully",
        };
    } catch (error: any) {
        return {
            type: "error",
            message: error.message,
        };
    }
}

export async function getZapWorkspace(): Promise<ZapApiResponse> {
    try {
        const workspaces = await getWorkspace();
        return {
            type: "success",
            message: workspaces,
        };
    } catch (error: any) {
        return {
            type: "error",
            message: error.message,
        };
    }
}

export async function getZapWorkspaceRecusrsively(
    name: string,
): Promise<ZapApiResponse> {
    try {
        const entries = await getWorkspaceRecursively(name);
        return {
            type: "success",
            message: entries,
        };
    } catch (error: any) {
        return {
            type: "error",
            message: error.message,
        };
    }
}

export async function getZapFileContent(path: string): Promise<ZapApiResponse> {
    try {
        const content = await getFileContent(path);
        return {
            type: "success",
            message: content,
        };
    } catch (error: any) {
        return {
            type: "error",
            message: error.message,
        };
    }
}

export async function moveZapRequest(
    source: { path: string; isDir: boolean; name: string },
    target: string,
): Promise<ZapApiResponse> {
    try {
        await moveFile(source, target);
        return {
            type: "success",
            message: "File moved successfully",
        };
    } catch (error: any) {
        return {
            type: "error",
            message: error.message,
        };
    }
}

export async function renameZapRequest(
    path: string,
    newName: string,
): Promise<ZapApiResponse> {
    try {
        await renameFile(path, newName);
        return {
            type: "success",
            message: "File renamed successfully",
        };
    } catch (error: any) {
        return {
            type: "error",
            message: error.message,
        };
    }
}

export async function renameZapFolder(
    path: string,
    newName: string,
): Promise<ZapApiResponse> {
    try {
        await renameFolder(path, newName);
        return {
            type: "success",
            message: "File renamed successfully",
        };
    } catch (error: any) {
        return {
            type: "error",
            message: error.message,
        };
    }
}

export async function writeZapFile(
    path: string,
    content: any,
): Promise<ZapApiResponse> {
    try {
        await writeFile(path, content);
        return {
            type: "success",
            message: "File saved successfully",
        };
    } catch (error: any) {
        return {
            type: "error",
            message: error.message,
        };
    }
}
