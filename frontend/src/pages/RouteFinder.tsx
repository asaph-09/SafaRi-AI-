import { useState } from "react";
import { MapPin, Navigation, Search, ArrowRight, RotateCcw } from "lucide-react";
import { findRoute } from "../api";
import LoadingSpinner from "../components/LoadingSpinner";

export default function RouteFinder() {
    const [origin, setOrigin] = useState("");
    const [destination, setDestination] = useState("");
    const [result, setResult] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!origin.trim() || !destination.trim()) return;

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const data = await findRoute(origin.trim(), destination.trim());
            setResult(data.advice);
        } catch (err: any) {
            setError(err.message || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setOrigin("");
        setDestination("");
        setResult(null);
        setError(null);
    };

    const handleSwap = () => {
        setOrigin(destination);
        setDestination(origin);
    };

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            {/* Header */}
            <div className="text-center mb-8 animate-fade-in-up">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-safari-500/10 border border-safari-500/20 text-safari-400 text-sm font-medium mb-4">
                    <Navigation className="w-4 h-4" />
                    Route Finder
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                    Find Your <span className="gradient-text">Matatu Route</span>
                </h1>
                <p className="text-slate-400 max-w-lg mx-auto">
                    Enter your origin and destination to get detailed matatu route advice including fares, stages, and travel time.
                </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="glass-card p-6 sm:p-8 mb-6 animate-fade-in-up-delay-1">
                <div className="flex flex-col gap-4">
                    {/* Origin */}
                    <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-safari-500" />
                        <input
                            id="origin-input"
                            type="text"
                            value={origin}
                            onChange={(e) => setOrigin(e.target.value)}
                            placeholder="From — e.g. Westlands, Eastleigh, Rongai..."
                            className="w-full pl-12 pr-4 py-3.5 bg-slate-800/60 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-safari-500/50 focus:ring-2 focus:ring-safari-500/20 transition-all"
                        />
                    </div>

                    {/* Swap button */}
                    <div className="flex justify-center">
                        <button
                            type="button"
                            onClick={handleSwap}
                            className="p-2 rounded-full bg-slate-800 border border-slate-700/50 text-slate-400 hover:text-safari-400 hover:border-safari-500/30 transition-all hover:rotate-180 duration-300"
                            title="Swap origin and destination"
                        >
                            <RotateCcw className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Destination */}
                    <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-500" />
                        <input
                            id="destination-input"
                            type="text"
                            value={destination}
                            onChange={(e) => setDestination(e.target.value)}
                            placeholder="To — e.g. CBD, JKIA, Thika Road Mall..."
                            className="w-full pl-12 pr-4 py-3.5 bg-slate-800/60 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all"
                        />
                    </div>

                    {/* Submit */}
                    <button
                        id="find-route-btn"
                        type="submit"
                        disabled={loading || !origin.trim() || !destination.trim()}
                        className="flex items-center justify-center gap-2 w-full py-3.5 bg-gradient-to-r from-safari-500 to-safari-600 text-white font-semibold rounded-xl shadow-lg shadow-safari-500/25 hover:shadow-safari-500/40 hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-200"
                    >
                        <Search className="w-5 h-5" />
                        Find Route
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </form>

            {/* Loading */}
            {loading && (
                <div className="glass-card p-8">
                    <LoadingSpinner text="Finding the best route for you..." />
                </div>
            )}

            {/* Error */}
            {error && (
                <div className="glass-card p-6 border-red-500/30 bg-red-500/5 animate-fade-in-up">
                    <p className="text-red-400 text-sm">⚠️ {error}</p>
                    <button
                        onClick={handleReset}
                        className="mt-3 text-sm text-slate-400 hover:text-white transition"
                    >
                        Try again
                    </button>
                </div>
            )}

            {/* Result */}
            {result && (
                <div className="glass-card p-6 sm:p-8 animate-fade-in-up">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                            🚌 Route Results
                        </h2>
                        <button
                            onClick={handleReset}
                            className="text-sm text-slate-400 hover:text-safari-400 transition flex items-center gap-1"
                        >
                            <RotateCcw className="w-3 h-3" />
                            New search
                        </button>
                    </div>
                    <div className="text-sm text-slate-400 mb-4">
                        <span className="text-safari-400 font-medium">{origin}</span>
                        {" → "}
                        <span className="text-amber-400 font-medium">{destination}</span>
                    </div>
                    <div className="markdown-content text-slate-200 whitespace-pre-wrap leading-relaxed">
                        {result}
                    </div>
                </div>
            )}
        </div>
    );
}
