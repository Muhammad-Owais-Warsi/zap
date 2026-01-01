import { entriesType } from "@/hooks/useWorkspace";

export function getFileByPath(
    tree: entriesType[],
    path: string,
): entriesType | undefined {
    for (const entry of tree) {
        if (!entry.is_dir && entry.path === path) return entry;
        if (entry.is_dir && entry.items) {
            const found = getFileByPath(entry.items, path);
            if (found) return found;
        }
    }
    return undefined;
}
