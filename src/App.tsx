import "./App.css";
import MainLayout from "./layouts/main";
import WorkspaceSelector from "./components/workspace/selector";
import { useCwdStore } from "./store/cwd-store";

function App() {
    const name = useCwdStore((state) => state.name);

    if (!name) {
        return <WorkspaceSelector />;
    }

    return <MainLayout workspace={name} />;
}

export default App;
