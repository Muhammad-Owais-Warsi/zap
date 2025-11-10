import { ZapCookie, ZapEnvironment, ZapRequest, ZapVariables } from "./request";

// PROBLEM TO SOLVE
// should we really need to keep variables[] in folderconfig ??
// maybe moving it to workspace config works well and reduce the heavy task
// for that we need to save the workspace config file in the local stoarage

// {
//   key:"key",
//   value:"value",
//   rootDir: "workspace/folder1",
//   scope: "workspace"
// }

// {
//   key:"key",
//   value:"value",
//   rootDir: "workspace/folder2",
//   scope: "folder"
// }

// https://google.com/<variable> -> {{base_url}}/<variable>
// {{base_url}} = https://google.com

// before sending the request I'll check the workspace config for wether this variable is present or not if yes then whats the scope?
// problem with the above statement might be
// lets say 2 folders i ahve variable in first scoped to folder and in other folder same variable i still ahve the acesss but i shouldnt
// coz it should be sccoped for the 1 folder only

// so for that variables have the rootDir variable also
// so instead of checking the scope we just match out current path and rootDir path
// but it doesnt means we remove scope coz user need to see that and by default all variables move to workspace level

// we are strict for duplicate keys on the same level
// now this is another issue
// this means before setting we need to check wether at the same level same variables exist or not
// for ux/ui giving options to replace or edit would be better but we can show error also for now

// for enviroments by default all variables will move to default enviorment
// you can create your own enviroments
// and can add variables up there or import it from other existing ones

// this give rise to another issue that we cant keep variables and env variables sepratly coz we dont want
// to access another enviroment variables in some other enviroment
// to solve this we can think of keeping only enviroment filed instead of variables
// then we can match based on path as before +  the enviroment

export type ZapWorkspaceConfig = {
    name: string;
    path: string;
    // children: ZapFolderNode[] | ZapFileNode[];
    // variables: ZapVariables[];
    environments: ZapEnvironment;
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
    // variables: ZapVariables[];
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
