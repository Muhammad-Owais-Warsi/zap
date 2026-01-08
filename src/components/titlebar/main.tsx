import { Button } from "../ui/button";
import { useState, useEffect, useRef } from "react";
import { Maximize, Minus, X } from "lucide-react";
import { close, maximize, minimize, enableDragging } from "./config";
import EnvironmentSwitcher from "../environment/switcher";
import { WorkspaceSwitcher } from "../workspace/switcher";

export default function ZapTitleBar() {
    const [currentTime, setCurrentTime] = useState(new Date());
    const dragAreaRef = useRef(null);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (dragAreaRef.current) {
            enableDragging(dragAreaRef.current);
        }
    }, []);

    const formatDate = (date: Date) => {
        return date.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
        });
    };

    return (
        <div className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center w-full h-10 bg-background border-b select-none">
            <div className="flex items-center pl-4">
                <EnvironmentSwitcher />
                <WorkspaceSwitcher />
            </div>

            <div
                ref={dragAreaRef}
                className="flex-1 flex items-center justify-center gap-2 px-4"
            >
                <Button variant="ghost" size="xs" className="text-xs font-mono">
                    {formatDate(currentTime)}
                </Button>
            </div>

            <div className="flex items-center justify-center gap-5 pr-4">
                <Button
                    variant="ghost"
                    size="icon-tab"
                    className="hover:cursor-pointer"
                    onClick={(e) => {
                        e.stopPropagation();
                        minimize();
                    }}
                >
                    <Minus />
                </Button>
                <Button
                    variant="ghost"
                    size="icon-tab"
                    className="hover:cursor-pointer"
                    onClick={(e) => {
                        e.stopPropagation();
                        maximize();
                    }}
                >
                    <Maximize />
                </Button>
                <Button
                    variant="destructive"
                    size="icon-tab"
                    className="hover:cursor-pointer"
                    onClick={(e) => {
                        e.stopPropagation();
                        close();
                    }}
                >
                    <X />
                </Button>
            </div>
        </div>
    );
}
