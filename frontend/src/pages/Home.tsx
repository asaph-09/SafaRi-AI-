import { Link } from "react-router-dom";
import { Map, Camera, MessageCircle, ArrowRight, Bus, Sparkles } from "lucide-react";

const features = [
    {
        to: "/routes",
        icon: Map,
        title: "Route Finder",
        titleSw: "Tafuta Njia",
        description: "Find the best matatu routes across Nairobi. Get fare estimates, boarding points, and travel times.",
        gradient: "from-safari-500 to-emerald-600",
        bgGlow: "bg-safari-500/10",
    },
    {
        to: "/hazard",
        icon: Camera,
        title: "Hazard Reporter",
        titleSw: "Ripoti Hatari",
        description: "Upload road photos for instant AI analysis. Identify potholes, floods, and accidents with severity ratings.",
        gradient: "from-amber-500 to-orange-600",
        bgGlow: "bg-amber-500/10",
    },
    {
        to: "/chat",
        icon: MessageCircle,
        title: "Chat Assistant",
        titleSw: "Msaidizi wa Mazungumzo",
        description: "Ask anything about Nairobi transport. Get real-time advice in English or Swahili — like texting a local friend.",
        gradient: "from-blue-500 to-indigo-600",
        bgGlow: "bg-blue-500/10",
    },
];

export default function Home() {
    return (
        <div className="min-h-[calc(100vh-4rem)]">
            {/* Hero Section */}
            <section className="relative overflow-hidden">
                {/* Gradient background orbs */}
                <div className="absolute top-[-200px] left-[-100px] w-[500px] h-[500px] bg-safari-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-[-200px] right-[-100px] w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 sm:pt-24 sm:pb-28">
                    <div className="text-center max-w-3xl mx-auto">
                        {/* Badge */}
                        <div className="animate-fade-in-up inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-safari-500/10 border border-safari-500/20 text-safari-400 text-sm font-medium mb-6">
                            <Sparkles className="w-4 h-4" />
                            Powered by Google Gemini AI
                        </div>

                        {/* Main heading */}
                        <h1 className="animate-fade-in-up text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
                            <span className="text-white">Your Smart</span>
                            <br />
                            <span className="gradient-text">Nairobi Transport</span>
                            <br />
                            <span className="text-white">Assistant</span>
                        </h1>

                        {/* Subtitle */}
                        <p className="animate-fade-in-up-delay-1 text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-8 leading-relaxed">
                            Get instant matatu routes, report road hazards, and chat with an AI that knows Nairobi like a local.
                            <span className="text-safari-400 font-medium"> In English & Swahili.</span>
                        </p>

                        {/* CTA Buttons */}
                        <div className="animate-fade-in-up-delay-2 flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                to="/routes"
                                className="group flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-safari-500 to-safari-600 text-white font-semibold rounded-2xl shadow-lg shadow-safari-500/25 hover:shadow-safari-500/40 hover:scale-[1.02] transition-all duration-200"
                            >
                                <Bus className="w-5 h-5" />
                                Find My Route
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link
                                to="/chat"
                                className="flex items-center gap-2 px-8 py-3.5 glass-card text-slate-200 font-semibold rounded-2xl hover:bg-slate-800/80 hover:scale-[1.02] transition-all duration-200"
                            >
                                <MessageCircle className="w-5 h-5" />
                                Start Chatting
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                <div className="grid md:grid-cols-3 gap-6">
                    {features.map((feature, i) => (
                        <Link
                            key={feature.to}
                            to={feature.to}
                            className={`group glass-card p-6 sm:p-8 hover:border-slate-700/50 hover:scale-[1.02] transition-all duration-300 animate-fade-in-up-delay-${i + 1}`}
                        >
                            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform`}>
                                <feature.icon className="w-6 h-6 text-white" />
                            </div>

                            <h3 className="text-xl font-bold text-white mb-1">{feature.title}</h3>
                            <p className="text-sm text-safari-400/80 font-medium mb-3">{feature.titleSw}</p>
                            <p className="text-slate-400 text-sm leading-relaxed mb-4">
                                {feature.description}
                            </p>

                            <div className="flex items-center gap-2 text-safari-400 text-sm font-medium group-hover:gap-3 transition-all">
                                Get Started
                                <ArrowRight className="w-4 h-4" />
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-slate-800/50 py-8 text-center">
                <p className="text-slate-500 text-sm">
                    🚌 SafaRi AI — Making Nairobi commuting smarter, one route at a time.
                </p>
            </footer>
        </div>
    );
}
