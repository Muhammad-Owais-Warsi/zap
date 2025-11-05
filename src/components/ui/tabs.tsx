import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";

function Tabs({
    className,
    ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
    return (
        <TabsPrimitive.Root
            data-slot="tabs"
            className={cn("flex flex-col w-full", className)}
            {...props}
        />
    );
}

function TabsList({
    className,
    ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
    return (
        <TabsPrimitive.List
            data-slot="tabs-list"
            className={cn(
                "flex items-center gap-2 w-full bg-background/60 backdrop-blur-sm",
                className,
            )}
            {...props}
        />
    );
}

function TabsTrigger({
    className,
    ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
    return (
        <TabsPrimitive.Trigger
            data-slot="tabs-trigger"
            className={cn(
                // Base
                "relative flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground cursor-pointer select-none border-b-2 border-transparent",
                // Active State
                "data-[state=active]:text-primary data-[state=active]:border-primary data-[state=active]:font-medium data-[state=active]:bg-background",
                // Hover + Focus
                "hover:text-foreground focus-visible:outline-none focus-visible:text-primary focus-visible:border-primary",
                // Disabled
                "disabled:pointer-events-none disabled:opacity-50",
                className,
            )}
            {...props}
        />
    );
}

function TabsContent({
    className,
    ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
    return (
        <TabsPrimitive.Content
            data-slot="tabs-content"
            className={cn("flex-1 p-3 outline-none", className)}
            {...props}
        />
    );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
