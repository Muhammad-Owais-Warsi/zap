import PlaygroundMethodSelector from "./method-selector";
import PlaygroundSaveButton from "./save-button";
import PlaygroundUrlInput from "./url-input";

export default function PlaygroundMainInput() {
    return (
        <div>
            <PlaygroundMethodSelector />
            <PlaygroundUrlInput />
            <PlaygroundSaveButton />
        </div>
    );
}
