import "./App.css";
import MainLayout from "./layouts/main";
import WorkspaceSelector from "./components/workspace/selector";
import ZapTitleBar from "./components/titlebar/main";
import { useCwdStore } from "./store/new/cwd-store";

function App() {
    const workspace = useCwdStore().workspace;

    if (!workspace) {
        return <WorkspaceSelector />;
    }

    return (
        <div className="h-screen overflow-hidden">
            <ZapTitleBar />
            <div className="sidebar-with-titlebar h-full">
                <MainLayout workspace={workspace} />
            </div>
        </div>
    );
}

export default App;
