export default function MethodBadge({ method }: { method: string }) {
    const getMethodStyles = (method: string) => {
        switch (method.toUpperCase()) {
            case "GET":
                return "text-green-600 bg-green-600/10";
            case "POST":
                return "text-blue-600 bg-blue-600/10";
            case "PUT":
                return "text-yellow-600 bg-yellow-600/10";
            case "PATCH":
                return "text-orange-600 bg-orange-600/10";
            case "DELETE":
                return "text-red-600 bg-red-600/10";
            case "HEAD":
                return "text-purple-600 bg-purple-600/10";
            case "OPTIONS":
                return "text-cyan-600 bg-cyan-600/10";
            default:
                return "text-gray-600 bg-gray-600/10";
        }
    };

    return (
        <div
            className={`text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded ${getMethodStyles(method)}`}
        >
            {method}
        </div>
    );
}
