export function cleanString(content: any): string {
    if (typeof content !== "string") {
        // Convert numbers or objects safely
        content = String(content ?? "");
    }

    return content
        .replace(/^"|"$/g, "") // Remove surrounding quotes
        .replace(/\\n/g, "\n"); // Convert literal \n to actual newlines
}
