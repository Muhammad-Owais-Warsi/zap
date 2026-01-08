import { Label } from "../ui/label";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogClose,
    DialogTitle,
    DialogFooter,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import EnvironmentSelector from "./environment-selector";
import EnvrionmentScopeSelector from "./scope-selector";
import { useState } from "react";
import { writeZapFile } from "@/file-system/fs-operation";
import { ZapWorkspaceConfig } from "@/types/fs";
import { useCwdStore } from "@/store/cwd-store";
import { useVariableStore } from "@/store/variable-store";

interface EnvironmentModalProps {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    defaultValue: string;
    onSave?: (variableName: string) => void;
}

export default function EnvironmentModal({
    open,
    onOpenChange,
    defaultValue,
    onSave,
}: EnvironmentModalProps) {
    const [variableName, setVariableName] = useState("");

    const workspace = useCwdStore().workspace;
    const setWorkspaceConfig = useCwdStore().setWorkspaceConfig;
    const workspaceConfig = useCwdStore().workspaceConfig;
    const environment = useVariableStore().environment;
    const scope = useVariableStore().scope;

    const handleSave = async () => {
        if (variableName.trim() && onSave) {
            if (!workspaceConfig) return;
            if (!environment) {
                console.error("No environment selected");
                return;
            }

            const parsedConfig =
                typeof workspaceConfig === "string"
                    ? JSON.parse(workspaceConfig)
                    : workspaceConfig;

            const updated_workspace_config: ZapWorkspaceConfig = {
                ...parsedConfig,
                environments: {
                    ...parsedConfig.environments,
                    [environment]: [
                        ...(parsedConfig.environments?.[environment] ?? []),
                        {
                            key: variableName.trim(),
                            value: defaultValue,
                            scope,
                        },
                    ],
                },
            };

            console.log(updated_workspace_config);

            const result = await writeZapFile(
                `${workspace}/workspace_config.json`,
                JSON.stringify(updated_workspace_config),
            );

            if (result.type === "error") return;

            setWorkspaceConfig(updated_workspace_config);
            onSave(variableName.trim());
            setVariableName("");
            onOpenChange?.(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold">
                        Set as Variable
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <Label
                            htmlFor="name"
                            className="w-1/3 text-sm font-medium"
                        >
                            Name
                        </Label>
                        <Input
                            id="name"
                            name="name"
                            className="w-2/3"
                            placeholder="Enter variable name"
                            value={variableName}
                            onChange={(e) => setVariableName(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <Label
                            htmlFor="value"
                            className="w-1/3 text-sm font-medium"
                        >
                            Value
                        </Label>
                        <Input
                            id="value"
                            name="value"
                            className="w-2/3"
                            placeholder="Enter value"
                            disabled
                            value={defaultValue}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <Label
                            htmlFor="environment"
                            className="w-1/3 text-sm font-medium"
                        >
                            Environment
                        </Label>
                        <div className="w-2/3">
                            <EnvironmentSelector
                                workspaceConfig={workspaceConfig}
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <Label
                            htmlFor="scope"
                            className="w-1/3 text-sm font-medium"
                        >
                            Scope
                        </Label>
                        <div className="w-2/3">
                            <EnvrionmentScopeSelector />
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button
                        onClick={handleSave}
                        disabled={!variableName.trim()}
                    >
                        Save
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
