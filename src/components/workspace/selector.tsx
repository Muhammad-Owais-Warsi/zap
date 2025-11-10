import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCwdStore } from "../../store/cwd-store";
import { useWorkspace } from "@/hooks/useWorkspace";
import { useTabsStore } from "@/store/tabs-store";
import {
    createZapWorkspace,
    getZapFileContent,
} from "@/file-system/fs-operation";

export default function WorkspaceSelector() {
    const name = useCwdStore((state) => state.name);
    const setWorkspaceConfig = useCwdStore((state) => state.setWorkspaceConfig);
    const updateName = useCwdStore((state) => state.updateName);
    const setWorkspaces = useCwdStore((state) => state.setWorkspaces);
    const resetCwdStore = useCwdStore((state) => state.resetCwdStore);
    const resetTabsStore = useTabsStore((state) => state.resetTabStore);
    const { workspaces, loading } = useWorkspace();
    const [newWorkspace, setNewWorkspace] = useState("");

    useEffect(() => {
        setWorkspaces(workspaces);
    }, [workspaces]);

    const handleSelect = async (workspace: string) => {
        const content = await getZapFileContent(
            `${workspace}/workspace_config.json`,
        );
        // console.log(content);
        setWorkspaceConfig(JSON.parse(content.message));
        updateName(workspace);
    };

    // workspace config setting logic to local storage
    const handleAddWorkspace = async () => {
        if (!newWorkspace.trim()) return;
        await createZapWorkspace(newWorkspace);
        const content = await getZapFileContent(
            `${newWorkspace}/workspace_config.json`,
        );
        setWorkspaceConfig(JSON.parse(content.message));
        updateName(newWorkspace);
        setNewWorkspace("");
        resetCwdStore();
        resetTabsStore();
        updateName(newWorkspace);
    };

    if (loading) return <div className="text-center mt-10">Loading...</div>;

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="flex w-[900px] items-center gap-16">
                <div className="w-[320px] flex flex-col gap-3">
                    <h1 className="text-muted-foreground  mb-2 text-bold text-left">
                        Workspace
                    </h1>
                    <p className="text-sm text-muted-foreground text-left mb-2 text-bold">
                        Select or create a new one
                    </p>

                    <div className="flex flex-col max-h-[300px] overflow-y-auto">
                        {workspaces.map((ws, idx) => (
                            <div key={idx}>
                                <Button
                                    variant={name === ws ? "default" : "ghost"}
                                    className="w-full justify-center text-sm h-10"
                                    onClick={() => handleSelect(ws)}
                                >
                                    {ws}
                                </Button>
                                {idx < workspaces.length - 1 && (
                                    <Separator className="my-1" />
                                )}
                            </div>
                        ))}
                    </div>

                    <Separator className="my-1" />

                    <div className="flex gap-2">
                        <Input
                            placeholder="New workspace"
                            value={newWorkspace}
                            onChange={(e) => setNewWorkspace(e.target.value)}
                            className="h-9 text-sm"
                            onKeyDown={(e) =>
                                e.key === "Enter" && handleAddWorkspace()
                            }
                        />
                        <Button onClick={handleAddWorkspace} className="h-9">
                            Add
                        </Button>
                    </div>
                </div>

                <div className="h-[350px] w-px bg-border"></div>

                <div className="flex-1 flex flex-col items-center justify-center text-center">
                    <h1 className="text-9xl font-bold mb-6 ">ZAP</h1>
                    <p className="text-lg text-muted-foreground">
                        A lightweight{" "}
                        <span className="text-[oklch(0.7392_0.1154_242.0535)]">
                            API client
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
}
