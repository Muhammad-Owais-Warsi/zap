import { useState } from "react";
import { useCwdStore } from "@/store/cwd-store";
import { ChevronDown, ChevronRight, Plus, Settings2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";

export default function EnvironmentSettings() {
    const workspaceConfig = useCwdStore((state) => state.workspaceConfig);
    const [openEnvironments, setOpenEnvironments] = useState<Set<string>>(
        new Set(["default"]),
    );

    if (!workspaceConfig?.environments) {
        return (
            <div className="flex flex-col items-center justify-center h-40 space-y-3">
                <Settings2 className="h-8 w-8 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">
                    No environments configured
                </p>
            </div>
        );
    }

    const environments = workspaceConfig.environments;

    const toggleEnvironment = (envName: string) => {
        setOpenEnvironments((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(envName)) {
                newSet.delete(envName);
            } else {
                newSet.add(envName);
            }
            return newSet;
        });
    };

    return (
        <ScrollArea className="h-full">
            <div className="p-4 space-y-2">
                {Object.entries(environments).map(([envName, variables]) => {
                    const isOpen = openEnvironments.has(envName);
                    const variableCount = variables?.length ?? 0;

                    return (
                        <Collapsible
                            key={envName}
                            open={isOpen}
                            onOpenChange={() => toggleEnvironment(envName)}
                            className="border rounded-lg overflow-hidden"
                        >
                            <CollapsibleTrigger asChild>
                                <div className="flex items-center justify-between p-3 hover:bg-muted/50 cursor-pointer group">
                                    <div className="flex items-center gap-3">
                                        {isOpen ? (
                                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                        ) : (
                                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                        )}
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-sm">
                                                {envName}
                                            </span>
                                            <Badge
                                                variant="secondary"
                                                className="h-5 px-2 text-xs font-normal"
                                            >
                                                {variableCount}
                                            </Badge>
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6 opacity-0 group-hover:opacity-100 "
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            // Add new variable logic here
                                        }}
                                    >
                                        <Plus className="h-3 w-3" />
                                    </Button>
                                </div>
                            </CollapsibleTrigger>

                            <CollapsibleContent>
                                <Separator />
                                <div className="p-3 space-y-2 ">
                                    {variables && variables.length > 0 ? (
                                        <div className="space-y-2">
                                            {variables.map((variable, i) => (
                                                <div
                                                    key={i}
                                                    className="flex flex-wrap items-start gap-2 p-2 rounded-md  border border-border/50 hover:border-border"
                                                >
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <Badge
                                                                variant="outline"
                                                                className="h-5 px-2 text-xs font-mono"
                                                            >
                                                                {variable.key}
                                                            </Badge>
                                                            {variable.scope && (
                                                                <Badge
                                                                    variant="secondary"
                                                                    className="h-4 px-1.5 text-xs"
                                                                >
                                                                    {
                                                                        variable.scope
                                                                    }
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <div className="text-xs text-muted-foreground  break-all">
                                                            {variable.value ? (
                                                                <span>
                                                                    {
                                                                        variable.value
                                                                    }
                                                                </span>
                                                            ) : (
                                                                <span className="italic">
                                                                    No value
                                                                </span>
                                                            )}
                                                        </div>
                                                        {variable.rootDir && (
                                                            <div className="text-xs text-muted-foreground/70 mt-1">
                                                                📁{" "}
                                                                {
                                                                    variable.rootDir
                                                                }
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-6 text-center">
                                            <div className="text-xs text-muted-foreground/70 mb-2">
                                                No variables defined
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="h-7 px-3 text-xs"
                                            >
                                                <Plus className="h-3 w-3 mr-1" />
                                                Add Variable
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </CollapsibleContent>
                        </Collapsible>
                    );
                })}

                {Object.keys(environments).length === 0 && (
                    <div className="flex flex-col items-center justify-center py-8 text-center space-y-3">
                        <div className="text-sm text-muted-foreground">
                            No environments found
                        </div>
                        <Button variant="outline" size="sm">
                            <Plus className="h-4 w-4 mr-2" />
                            Create Environment
                        </Button>
                    </div>
                )}
            </div>
        </ScrollArea>
    );
}
