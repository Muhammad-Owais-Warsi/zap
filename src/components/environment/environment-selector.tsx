import { ZapWorkspaceConfig } from "@/types/fs";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectGroup,
    SelectItem,
} from "../ui/select";
import { useVariableStore } from "@/store/variable-store";

export default function EnvironmentSelector({
    workspaceConfig,
}: {
    workspaceConfig?: ZapWorkspaceConfig;
}) {
    const setEnvironment = useVariableStore().setEnvironment;

    console.log("HEREEEE", workspaceConfig);

    const handleEnvironmentSelect = (env: string) => {
        setEnvironment(env);
    };

    return (
        <Select onValueChange={(value) => handleEnvironmentSelect(value)}>
            <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Environment" />
            </SelectTrigger>

            <SelectContent>
                <SelectGroup>
                    {Object.entries(workspaceConfig?.environments ?? {}).map(
                        ([envName]) => (
                            <SelectItem
                                key={envName}
                                value={envName}
                                className="hover:cursor-pointer"
                            >
                                {envName}
                            </SelectItem>
                        ),
                    )}

                    <div className="border-t my-1" />

                    <div className="flex items-center gap-2 px-2 py-2 text-sm text-muted-foreground select-none">
                        <span>Add new environment from settings</span>
                    </div>
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}
