import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Bus, Map, Camera, MessageCircle, Menu, X } from "lucide-react";

const navLinks = [
    { to: "/", label: "Home", icon: Bus },
    { to: "/routes", label: "Route Finder", icon: Map },
    { to: "/hazard", label: "Hazard Report", icon: Camera },
    { to: "/chat", label: "Chat", icon: MessageCircle },
];

export default function Navbar() {
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <nav className="sticky top-0 z-50 glass-card border-b border-slate-800/50 rounded-none">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-safari-500 to-safari-700 flex items-center justify-center shadow-lg group-hover:shadow-safari-500/30 transition-shadow">
                            <Bus className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold gradient-text">
                            SafaRi AI
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map(({ to, label, icon: Icon }) => {
                            const active = location.pathname === to;
                            return (
                                <Link
                                    key={to}
                                    to={to}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${active
                                            ? "bg-safari-500/15 text-safari-400 shadow-inner"
                                            : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                                        }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    {label}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Mobile toggle */}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                    >
                        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile Nav */}
            {mobileOpen && (
                <div className="md:hidden border-t border-slate-800/50 px-4 pb-4 pt-2 space-y-1">
                    {navLinks.map(({ to, label, icon: Icon }) => {
                        const active = location.pathname === to;
                        return (
                            <Link
                                key={to}
                                to={to}
                                onClick={() => setMobileOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${active
                                        ? "bg-safari-500/15 text-safari-400"
                                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                {label}
                            </Link>
                        );
                    })}
                </div>
            )}
        </nav>
    );
}
