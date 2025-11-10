import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PlaygroundConfigQueryParamsTable from "./query-params";
import { Separator } from "@/components/ui/separator";
import PlaygroundConfigHeadersTable from "./headers";
import PlaygroundConfigSettings from "./settings";
import PlaygroundConfigAuth from "./auth";
import JsonEditor from "@/components/editor/editor";

export default function PlaygroundMainConfig() {
    return (
        <div className="flex w-full">
            <Tabs defaultValue="params">
                <TabsList>
                    <TabsTrigger value="params">Params</TabsTrigger>
                    <TabsTrigger value="auth">Authorization</TabsTrigger>
                    <TabsTrigger value="headers">Headers</TabsTrigger>
                    <TabsTrigger value="body">Body</TabsTrigger>

                    {/*network config*/}
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>

                <Separator orientation="horizontal" className="w-full" />

                <TabsContent value="params">
                    <PlaygroundConfigQueryParamsTable />
                </TabsContent>
                <TabsContent value="auth">
                    <PlaygroundConfigAuth />
                </TabsContent>
                <TabsContent value="headers">
                    <PlaygroundConfigHeadersTable />
                </TabsContent>
                <TabsContent value="body">
                    <JsonEditor />
                </TabsContent>
                <TabsContent value="settings">
                    <PlaygroundConfigSettings />
                </TabsContent>
            </Tabs>
        </div>
    );
}
