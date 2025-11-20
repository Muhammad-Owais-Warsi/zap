import "./App.css";
import MainLayout from "./layouts/main";
import WorkspaceSelector from "./components/workspace/selector";
import { useCwdStore } from "./store/cwd-store";
import ZapTitleBar from "./components/titlebar/main";

function App() {
    const name = useCwdStore((state) => state.name);

    if (!name) {
        return <WorkspaceSelector />;
    }

    return (
        <div className="h-screen overflow-hidden">
            <ZapTitleBar />
            <div className="sidebar-with-titlebar h-full">
                <MainLayout workspace={name} />
            </div>
        </div>
    );
}

export default App;
