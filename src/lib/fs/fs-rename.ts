import { entriesType } from "@/hooks/useWorkspace";

export function renameEntryInTree(
    tree: entriesType[],
    oldPath: string,
    newName: string,
): entriesType[] {
    return tree.map((entry) => {
        if (entry.path === oldPath) {
            const parentPath = oldPath.split("/").slice(0, -1).join("/");
            const isFile = !entry.is_dir;
            const newPath = isFile
                ? `${parentPath}/${newName}.json`
                : `${parentPath}/${newName}`;
            return {
                ...entry,
                name: isFile ? `${newName}.json` : newName,
                path: newPath,
                items: entry.items
                    ? updateChildrenPaths(entry.items, oldPath, newPath)
                    : entry.items,
            };
        }
        if (entry.is_dir && entry.items) {
            return {
                ...entry,
                items: renameEntryInTree(entry.items, oldPath, newName),
            };
        }
        return entry;
    });
}

// Helper to recursively update children's paths when a folder is renamed
function updateChildrenPaths(
    items: entriesType[],
    oldParentPath: string,
    newParentPath: string,
): entriesType[] {
    return items.map((child) => {
        const updatedPath = child.path.replace(oldParentPath, newParentPath);
        return {
            ...child,
            path: updatedPath,
            items: child.items
                ? updateChildrenPaths(child.items, oldParentPath, newParentPath)
                : child.items,
        };
    });
}
