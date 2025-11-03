import PlaygroundMethodSelector from "./method-selector";
import PlaygroundSaveButton from "./save-button";
import PlaygroundSubmitButton from "./submit-button";
import PlaygroundUrlInput from "./url-input";

export default function PlaygroundMainInput() {
    return (
        <div className="flex w-full gap-2 items-center">
            <div className="flex-none">
                <PlaygroundMethodSelector />
            </div>

            <div className="flex-1 min-w-0">
                <PlaygroundUrlInput />
            </div>

            <div className="flex-none">
                <PlaygroundSaveButton />
            </div>

            <div className="flex-none">
                <PlaygroundSubmitButton />
            </div>
        </div>
    );
}
