import { useState, useRef } from "react";
import { Camera, Upload, X, AlertTriangle, RotateCcw } from "lucide-react";
import { reportHazard } from "../api";
import LoadingSpinner from "../components/LoadingSpinner";

export default function HazardReporter() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [result, setResult] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFile = (file: File) => {
        if (!file.type.startsWith("image/")) {
            setError("Please select an image file (JPG, PNG, etc.)");
            return;
        }
        setSelectedFile(file);
        setError(null);
        setResult(null);

        const reader = new FileReader();
        reader.onload = (e) => setPreview(e.target?.result as string);
        reader.readAsDataURL(file);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
    };

    const handleSubmit = async () => {
        if (!selectedFile) return;

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const data = await reportHazard(selectedFile);
            setResult(data.analysis);
        } catch (err: any) {
            setError(err.message || "Failed to analyze image. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setSelectedFile(null);
        setPreview(null);
        setResult(null);
        setError(null);
    };

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            {/* Header */}
            <div className="text-center mb-8 animate-fade-in-up">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-medium mb-4">
                    <AlertTriangle className="w-4 h-4" />
                    Road Hazard Reporter
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                    Report a <span className="gradient-text">Road Hazard</span>
                </h1>
                <p className="text-slate-400 max-w-lg mx-auto">
                    Upload a photo of a pothole, flood, or road damage. Our AI will analyze it and generate a safety report in English & Swahili.
                </p>
            </div>

            {/* Upload Area */}
            {!preview && (
                <div
                    className={`glass-card p-8 sm:p-12 text-center animate-fade-in-up-delay-1 cursor-pointer transition-all duration-200 ${isDragging
                            ? "border-amber-500/50 bg-amber-500/5 scale-[1.01]"
                            : "hover:border-slate-600/50"
                        }`}
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                        className="hidden"
                        id="hazard-upload"
                    />

                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
                        <Camera className="w-8 h-8 text-white" />
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2">
                        {isDragging ? "Drop your image here" : "Upload Road Photo"}
                    </h3>
                    <p className="text-slate-400 text-sm mb-4">
                        Drag and drop an image, or click to browse
                    </p>

                    <div className="inline-flex items-center gap-2 px-6 py-2.5 bg-slate-800 border border-slate-700/50 rounded-xl text-slate-300 text-sm hover:bg-slate-700 transition">
                        <Upload className="w-4 h-4" />
                        Choose Image
                    </div>
                </div>
            )}

            {/* Preview + Analyze */}
            {preview && !result && !loading && (
                <div className="glass-card p-6 sm:p-8 animate-fade-in-up">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-white">📸 Image Preview</h3>
                        <button
                            onClick={handleReset}
                            className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="relative rounded-xl overflow-hidden mb-6 bg-slate-900">
                        <img
                            src={preview}
                            alt="Road hazard preview"
                            className="w-full max-h-[400px] object-contain"
                        />
                    </div>

                    <button
                        id="analyze-hazard-btn"
                        onClick={handleSubmit}
                        className="flex items-center justify-center gap-2 w-full py-3.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold rounded-xl shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-[1.01] transition-all duration-200"
                    >
                        <AlertTriangle className="w-5 h-5" />
                        Analyze Hazard
                    </button>
                </div>
            )}

            {/* Loading */}
            {loading && (
                <div className="glass-card p-8">
                    <LoadingSpinner text="Analyzing road condition..." />
                </div>
            )}

            {/* Error */}
            {error && (
                <div className="glass-card p-6 border-red-500/30 bg-red-500/5 animate-fade-in-up">
                    <p className="text-red-400 text-sm">⚠️ {error}</p>
                    <button onClick={handleReset} className="mt-3 text-sm text-slate-400 hover:text-white transition">
                        Try again
                    </button>
                </div>
            )}

            {/* Result */}
            {result && (
                <div className="animate-fade-in-up space-y-4">
                    {/* Image thumbnail */}
                    {preview && (
                        <div className="glass-card p-4 flex items-center gap-4">
                            <img src={preview} alt="Analyzed" className="w-20 h-20 object-cover rounded-xl" />
                            <div>
                                <p className="text-white font-medium text-sm">{selectedFile?.name}</p>
                                <p className="text-slate-400 text-xs">Analysis complete ✅</p>
                            </div>
                        </div>
                    )}

                    {/* Analysis */}
                    <div className="glass-card p-6 sm:p-8">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-white">🚨 Hazard Analysis</h2>
                            <button
                                onClick={handleReset}
                                className="text-sm text-slate-400 hover:text-amber-400 transition flex items-center gap-1"
                            >
                                <RotateCcw className="w-3 h-3" />
                                New report
                            </button>
                        </div>
                        <div className="markdown-content text-slate-200 whitespace-pre-wrap leading-relaxed">
                            {result}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
