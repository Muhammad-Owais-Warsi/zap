import "./App.css";

import { useEffect } from "react";
import { emit } from "@tauri-apps/api/event";
// import Page from "./layouts/main";
import MainLayout from "./layouts/main";
import WorkspaceSelector from "./components/workspace/selector";
import { useCwdStore } from "./store/cwd-store";

// function App() {
//     const [workspaceName, setWorkspaceName] = useState("");
//     const [folderName, setFolderName] = useState("");
//     const [requestName, setRequestName] = useState("");
//     const [variableKey, setVariableKey] = useState("");
//     const [variableValue, setVariableValue] = useState("");
//     const [variableScope, setVariableScope] = useState<
//         "global" | "folder" | "request"
//     >("global");

//     return (
//         <main className="container">
//             <h1>Zap Workspace Manager</h1>

//             {/* Workspace Section */}
//             <section className="section">
//                 <h2>Create Workspace</h2>
//                 <input
//                     type="text"
//                     placeholder="Workspace Name"
//                     value={workspaceName}
//                     onChange={(e) => setWorkspaceName(e.currentTarget.value)}
//                 />
//                 <Button
//                     onClick={async () => {
//                         console.log("Create workspace:", workspaceName);
//                         await createZapWorkspace("testing_zap_fs");
//                     }}
//                 >
//                     Create Workspace
//                 </Button>
//             </section>

//             {/* Folder Section */}
//             <section className="section">
//                 <h2>Create Folder</h2>
//                 <input
//                     type="text"
//                     placeholder="Folder Name"
//                     value={folderName}
//                     onChange={(e) => setFolderName(e.currentTarget.value)}
//                 />
//                 <Button
//                     onClick={async () => {
//                         console.log("Create folder:", folderName);
//                         await createZapFolder(
//                             "testing_zap_folder",
//                             "testing_zap_fs",
//                         );
//                     }}
//                 >
//                     Create Folder
//                 </Button>
//             </section>

//             {/* Request Section */}
//             <section className="section">
//                 <h2>Create Request</h2>
//                 <input
//                     type="text"
//                     placeholder="Request Name"
//                     value={requestName}
//                     onChange={(e) => setRequestName(e.currentTarget.value)}
//                 />
//                 <Button
//                     onClick={async () => {
//                         console.log("Create request:", requestName);
//                         await createZapRequest(
//                             "testing_zap_rq",
//                             "testing_zap_fs/testing_zap_folder",
//                         );
//                     }}
//                 >
//                     Create Request
//                 </Button>
//             </section>

//             {/* Variable Section */}
//             <section className="section">
//                 <h2>Create / Update Variable</h2>
//                 <input
//                     type="text"
//                     placeholder="Key"
//                     value={variableKey}
//                     onChange={(e) => setVariableKey(e.currentTarget.value)}
//                 />
//                 <input
//                     type="text"
//                     placeholder="Value"
//                     value={variableValue}
//                     onChange={(e) => setVariableValue(e.currentTarget.value)}
//                 />
//                 <select
//                     value={variableScope}
//                     onChange={(e) =>
//                         setVariableScope(e.currentTarget.value as any)
//                     }
//                 >
//                     <option value="global">Global</option>
//                     <option value="folder">Folder</option>
//                     <option value="request">Request</option>
//                 </select>
//                 <Button
//                     onClick={async () =>
//                         console.log(
//                             "Set variable:",
//                             variableKey,
//                             variableValue,
//                             variableScope,
//                         )
//                     }
//                 >
//                     Set Variable
//                 </Button>
//             </section>

//             {/* Logos / Footer */}
//             <div className="row">
//                 <a href="https://vite.dev" target="_blank">
//                     <img
//                         src="/vite.svg"
//                         className="logo vite"
//                         alt="Vite logo"
//                     />
//                 </a>
//                 <a href="https://tauri.app" target="_blank">
//                     <img
//                         src="/tauri.svg"
//                         className="logo tauri"
//                         alt="Tauri logo"
//                     />
//                 </a>
//                 <a href="https://react.dev" target="_blank">
//                     <img
//                         src={reactLogo}
//                         className="logo react"
//                         alt="React logo"
//                     />
//                 </a>
//             </div>
//         </main>
//     );
// }

function App() {
    const name = useCwdStore((state) => state.name);

    useEffect(() => {
        // Notify Rust that frontend is ready
        emit("frontend-ready");
    }, []);

    if (!name) {
        return <WorkspaceSelector />;
    }

    return <MainLayout workspace={name} />;
}

export default App;
