import { ZapWorkspaceConfig } from "@/types/fs";

export default function parseUrl(
    url: string,
    workspaceConfig: ZapWorkspaceConfig,
    currentEnv: string,
    path: string,
) {
    const varPattern = /\{\{(.+?)\}\}/;

    const match = url.match(varPattern);

    if (!match) return url;

    const variable = match[1];

    const value = workspaceConfig.environments[currentEnv].find(
        (vars) => vars.key === variable,
    );

    if (value?.scope === "workspace")
        return `${value.value}${url.replace(varPattern, "")}`;

    const id = path.match(/\[(.*?)\]/)?.[1] || null;
    if (!id) return;
    if (value?.rootId === id) {
        return url.replace(varPattern, value.value);
    }

    return url;
}
