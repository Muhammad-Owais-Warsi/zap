export function cleanString(content: string) {
    return (
        content
            ?.replace(/^"|"$/g, "") // Remove leading/trailing quotes
            .replace(/\\n/g, "\n") || "" // Convert escaped \n to real newlines
    );
}
