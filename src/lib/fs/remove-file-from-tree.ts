import { entriesType } from "@/hooks/useWorkspace";

export function removeFileFromTree(
    tree: entriesType[],
    path: string,
): entriesType[] {
    return tree
        .filter((entry) => entry.path !== path)
        .map((entry) =>
            entry.is_dir && entry.items
                ? { ...entry, items: removeFileFromTree(entry.items, path) }
                : entry,
        );
}
