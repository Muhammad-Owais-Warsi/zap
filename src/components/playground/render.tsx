import { useCwdStore } from "@/store/cwd-store";
import PlaygroundTabs from "./tabs/tabs";
import PlaygroundMainInput from "./input/main";
import CodeEditor from "../editor/editor";
import PlaygroundMainConfig from "./config/main";
// import JsonEditor from "../editor/editor";

export default function Render() {
    console.log("Render re-rendered");
    const selectedFile = useCwdStore((state) => state.selectedFile);
    return (
        <>
            <PlaygroundTabs />
            <PlaygroundMainInput />
            {/*<CodeEditor />*/}
            <PlaygroundMainConfig />
            {selectedFile?.content}
        </>
    );
}
