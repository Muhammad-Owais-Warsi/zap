const fileToString = async (file: File): Promise<string> => {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
            const base64 = reader.result as string;
            const fileData = {
                name: file.name,
                type: file.type,
                size: file.size,
                lastModified: file.lastModified,
                data: base64.split(",")[1], // Remove data:mime;base64, prefix
            };
            resolve(JSON.stringify(fileData));
        };
        reader.readAsDataURL(file);
    });
};

const stringToFile = (str: string): File | null => {
    try {
        const parsed = JSON.parse(str);
        if (parsed.name && parsed.data) {
            // Convert base64 back to File
            const byteCharacters = atob(parsed.data);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            return new File([byteArray], parsed.name, {
                type: parsed.type,
                lastModified: parsed.lastModified,
            });
        }
    } catch (e) {
        // Not a serialized file
    }
    return null;
};

const stringToFileInfo = (str: string) => {
    try {
        const parsed = JSON.parse(str);
        if (parsed.name && parsed.data) {
            return parsed;
        }
    } catch (e) {
        // Not a serialized file
    }
    return null;
};

const isSerializedFile = (value: string): boolean => {
    return stringToFileInfo(value) !== null;
};

export { fileToString, isSerializedFile, stringToFileInfo, stringToFile };
