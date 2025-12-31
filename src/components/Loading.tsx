import { RotateCcw } from "lucide-react";

export default function Loading() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-blue-600">
            <RotateCcw className="w-10 h-10 animate-spin mb-4" />
            <p className="text-gray-500 font-medium">Loading...</p>
        </div>
    );
}
