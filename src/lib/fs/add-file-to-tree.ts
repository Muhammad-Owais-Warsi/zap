import { entriesType } from "@/hooks/useWorkspace";

export function addFileToTree(
    files: entriesType[],
    parentPath: string,
    newFile: entriesType,
): entriesType[] {
    let changed = false;

    const result = files.map((file) => {
        if (file.path === parentPath && file.is_dir) {
            changed = true;
            return {
                ...file,
                // expanded: true,
                items: [...(file.items ?? []), newFile],
            };
        }

        if (file.is_dir && file.items) {
            const updatedItems = addFileToTree(file.items, parentPath, newFile);
            if (updatedItems !== file.items) {
                changed = true;
                return { ...file, items: updatedItems };
            }
        }

        return file;
    });

    return changed ? result : files;
}
