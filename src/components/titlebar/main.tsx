import { useVariableStore } from "@/store/variable-store";
import { Button } from "../ui/button";
import { useState, useEffect, useRef } from "react";
import { Maximize, Minus, Square, X } from "lucide-react";
import { close, maximize, minimize, enableDragging } from "./config";
import { useCwdStore } from "@/store/cwd-store";
import EnvironmentSwitcher from "../environment/switcher";

export default function ZapTitleBar() {
    const currentEnv = useVariableStore((state) => state.current);
    const name = useCwdStore((state) => state.name);
    const [currentTime, setCurrentTime] = useState(new Date());
    const dragAreaRef = useRef(null);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString("en-US", {
            hour12: true,
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        });
    };

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
            </div>

            <div
                ref={dragAreaRef}
                className="flex-1 flex items-center justify-center gap-2 px-4"
            >
                <Button variant="ghost" size="xs" className="text-xs font-mono">
                    {formatDate(currentTime)}
                </Button>
                <Button variant="ghost" size="xs" className="text-xs font-mono">
                    {formatTime(currentTime)}
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
                    // color="destructive"
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
