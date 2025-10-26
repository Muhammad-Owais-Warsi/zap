import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCwdStore } from "../../store/cwd-store";
import { useWorkspace } from "@/hooks/useWorkspace";

export default function WorkspaceSelector() {
    const name = useCwdStore((state) => state.name);
    const updateName = useCwdStore((state) => state.updateName);
    const setWorkspaces = useCwdStore((state) => state.setWorkspaces);
    const { workspaces, loading } = useWorkspace();
    const [newWorkspace, setNewWorkspace] = useState("");

    useEffect(() => {
        setWorkspaces(workspaces);
    }, [workspaces]);

    const handleSelect = (workspace: string) => updateName(workspace);

    const handleAddWorkspace = () => {
        if (!newWorkspace.trim()) return;
        updateName(newWorkspace);
        setNewWorkspace("");
    };

    if (loading) return <div className="text-center mt-10">Loading...</div>;

    return (
        <div className="flex justify-center items-center min-h-screen bg-background">
            <div className="w-[360px] p-6 flex flex-col items-center">
                <h2 className="text-center text-lg font-medium mb-4">
                    Select your workspace or create new
                </h2>

                <div className="flex flex-col w-full gap-3">
                    {workspaces.map((ws: string, idx: number) => (
                        <Button
                            key={idx}
                            variant={name === ws ? "default" : "ghost"}
                            className="w-full justify-center text-base"
                            onClick={() => handleSelect(ws)}
                        >
                            {ws}
                        </Button>
                    ))}
                </div>

                <Separator className="my-4 w-full" />

                <div className="flex w-full gap-2">
                    <Input
                        placeholder="New workspace name"
                        value={newWorkspace}
                        onChange={(e) => setNewWorkspace(e.target.value)}
                    />
                    <Button onClick={handleAddWorkspace}>Add</Button>
                </div>
            </div>
        </div>
    );
}
