import { RotateCcw } from "lucide-react";

export default function Loading() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-primary">
            <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse"></div>
                <RotateCcw className="relative w-10 h-10 animate-spin mb-4 text-primary" />
            </div>
            <p className="text-slate-500 font-medium tracking-wide animate-pulse">Loading chemicals...</p>
        </div>
    );
}
