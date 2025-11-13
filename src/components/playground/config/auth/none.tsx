import { Unlock } from "lucide-react";

export default function PlaygroundConfigAuthNoAuth() {
    return (
        <div className="flex items-center justify-center h-full">
            {" "}
            <div className="text-center space-y-3 flex justify-center items-center flex-col">
                {" "}
                <div className="text-4xl ">
                    {" "}
                    <Unlock />{" "}
                </div>{" "}
                <h3 className="text-lg font-medium">
                    {" "}
                    No Authentication Required{" "}
                </h3>{" "}
                <p className="text-muted-foreground">
                    {" "}
                    Your request will be sent without authentication
                    headers{" "}
                </p>{" "}
            </div>{" "}
        </div>
    );
}
