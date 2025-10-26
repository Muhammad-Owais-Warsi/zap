import { useEffect, useState, useMemo } from "react";
import {
    getZapWorkspace,
    getZapWorkspaceRecusrsively,
} from "@/file-system/fs-operation";
import { useCwdStore } from "@/store/cwd-store";
import { Folder, File, type LucideProps } from "lucide-react";
import { RefAttributes, ForwardRefExoticComponent } from "react";
import { WorkspaceEntry } from "@/types/fs";

export function useWorkspace() {
    const [workspaces, setWorkspaces] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getZapWorkspace().then((res) => {
            setWorkspaces(res.message);
            setLoading(false);
        });
    }, []);

    return { workspaces, loading };
}

export type entriesType = {
    name: string;
    path: string;
    isDir: boolean;
    icon: ForwardRefExoticComponent<
        Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
    >;
    items?: entriesType[] | undefined;
};

export function useWorkspaceRecursive(path: string) {
    const [workspace, setWorkspace] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const workspaceUpdateTrigger = useCwdStore(
        (state) => state.workspaceUpdateTrigger,
    );

    async function fetchWorkspace() {
        setLoading(true);
        const res = await getZapWorkspaceRecusrsively(path);

        if (!res.message?.length) {
            setTimeout(async () => {
                const retry = await getZapWorkspaceRecusrsively(path);
                setWorkspace(retry.message);
                setLoading(false);
            }, 100);
        } else {
            setWorkspace(res.message);
            setLoading(false);
        }
    }
    useEffect(() => {
        if (!path) return;
        fetchWorkspace();
    }, [path, workspaceUpdateTrigger]);

    const renderEntries = (entries: WorkspaceEntry[]): entriesType[] => {
        if (!entries || entries.length === 0) return [];
        return entries.map((entry) => ({
            name: entry.name,
            path: entry.path,
            isDir: entry.isDirectory,
            icon: entry.isDirectory ? Folder : File,
            items: entry.children ? renderEntries(entry.children) : undefined,
        }));
    };

    const entries = useMemo(() => renderEntries(workspace), [workspace]);

    return { entries, loading, refresh: fetchWorkspace };
}
