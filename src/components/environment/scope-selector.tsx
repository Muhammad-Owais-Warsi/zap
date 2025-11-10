import { useVariableStore } from "@/store/variable-store";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectGroup,
    SelectItem,
} from "../ui/select";

export default function EnvrionmentScopeSelector() {
    const setScope = useVariableStore((state) => state.setScope);

    const handleScopeSelect = (scope: "workspace" | "folder") => {
        setScope(scope);
    };

    return (
        <Select
            onValueChange={(value) =>
                handleScopeSelect(value as "workspace" | "folder")
            }
        >
            <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Scope" />
            </SelectTrigger>
            <SelectContent defaultValue="Workspace">
                <SelectGroup>
                    <SelectItem
                        className="hover:cursor-pointer"
                        value="workspace"
                    >
                        Workspace
                    </SelectItem>
                    <SelectItem className="hover:cursor-pointer" value="folder">
                        {" "}
                        Folder
                    </SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}
