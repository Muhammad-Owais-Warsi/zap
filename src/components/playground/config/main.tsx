import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PlaygroundConfigQueryParamsTable from "./query-params";
import { Separator } from "@/components/ui/separator";
import PlaygroundConfigHeadersTable from "./headers";

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
                    Change your password here.
                </TabsContent>
                <TabsContent value="headers">
                    <PlaygroundConfigHeadersTable />
                </TabsContent>
                <TabsContent value="body">
                    Change your password here.
                </TabsContent>
                <TabsContent value="settings">
                    Change your password here.
                </TabsContent>
            </Tabs>
        </div>
    );
}
