import { createZapWorkspace } from "@/file-system/fs-operation";
import { Button } from "../ui/button";
// import { WorkspaceSwitcher } from "../workspace/switcher";
import { Plus } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import CreateFolder from "../fs/folder";
import CreateRequest from "../fs/file";
// import ImportRequest from "../fs/import";
import { useCwdStore } from "@/store/new/cwd-store";

export default function SideHeaders({ workspace }: { workspace: string }) {
    const setWorkspace = useCwdStore().setWorkspace;

    const handleCreateWorkspace = async () => {
        console.log(await createZapWorkspace("ZAP"));
        setWorkspace("ZAP");
    };

    return (
        <div className="">
            <div className="flex items-center justify-start gap-2">
                {/*<WorkspaceSwitcher />*/}
                <Tooltip>
                    <TooltipTrigger>
                        <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={handleCreateWorkspace}
                            className="flex items-center gap-2 hover:cursor-pointer"
                        >
                            <Plus />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>New Workspace</TooltipContent>
                </Tooltip>

                {/*<ImportRequest workspace={workspace} />*/}
                <CreateFolder />
                <CreateRequest />
            </div>

            <div className="-mx-2 border-t border-sidebar-border mt-1" />
        </div>
    );
}
