import { ZapCookie, ZapEnvironment, ZapRequest, ZapVariables } from "./request";

export type ZapWorkspaceConfig = {
    name: string;
    path: string;
    // children: ZapFolderNode[] | ZapFileNode[];
    // variables: ZapVariables[];
    environments: ZapEnvironment[] | [{ type: "default"; variables: [] }];
    cookieJar: ZapCookie[];
};

export type ZapFileConfig = {
    name: string;
    type: "file";
    path: string;
    content: ZapRequest;
};

export type ZapFolderConfig = {
    name: string;
    type: "folder";
    path: string;
    variables: ZapVariables[];
    // children: ZapFileNode[];
};

export interface WorkspaceEntry {
    name: string;
    path: string; // built manually
    isDirectory: boolean;
    children?: WorkspaceEntry[];
}

// enviroments are like dev, staging, prod which will always be at workspace level
// variables come under enviroment and will be either at workspace level or folder level
// if no environemtn by default "general"
// on switching environment no variables get copied but you can bring and change them up
