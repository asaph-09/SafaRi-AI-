import { Loader2 } from "lucide-react";

interface Props {
    text?: string;
    className?: string;
}

export default function LoadingSpinner({ text = "SafaRi AI is thinking...", className = "" }: Props) {
    return (
        <div className={`flex flex-col items-center justify-center gap-3 py-12 ${className}`}>
            <div className="relative">
                <Loader2 className="w-10 h-10 text-safari-500 animate-spin" />
                <div className="absolute inset-0 w-10 h-10 rounded-full bg-safari-500/20 animate-ping" />
            </div>
            <p className="text-slate-400 text-sm animate-pulse">{text}</p>
        </div>
    );
}
