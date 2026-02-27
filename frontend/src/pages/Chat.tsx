import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Trash2, Bus } from "lucide-react";
import { sendChatMessage, type ChatMessage } from "../api";

interface DisplayMessage {
    role: "user" | "model";
    text: string;
    timestamp: Date;
}

export default function Chat() {
    const [messages, setMessages] = useState<DisplayMessage[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, loading]);

    const handleSend = async () => {
        const text = input.trim();
        if (!text || loading) return;

        const userMessage: DisplayMessage = {
            role: "user",
            text,
            timestamp: new Date(),
        };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setLoading(true);

        try {
            // Build history for Gemini (all previous messages)
            const history: ChatMessage[] = messages.map((m) => ({
                role: m.role,
                text: m.text,
            }));

            const data = await sendChatMessage(text, history);

            const botMessage: DisplayMessage = {
                role: "model",
                text: data.response,
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, botMessage]);
        } catch (err: any) {
            const errorMessage: DisplayMessage = {
                role: "model",
                text: `⚠️ Sorry, something went wrong: ${err.message}. Please try again.`,
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setLoading(false);
            inputRef.current?.focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const clearChat = () => {
        setMessages([]);
        setInput("");
    };

    return (
        <div className="flex flex-col h-[calc(100vh-4rem)]">
            {/* Chat Header */}
            <div className="glass-card rounded-none border-x-0 border-t-0 px-4 sm:px-6 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                        <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-sm font-bold text-white">SafaRi AI Chat</h1>
                        <p className="text-xs text-safari-400">
                            {loading ? "Typing..." : "Online — Ask me anything about Nairobi transport"}
                        </p>
                    </div>
                </div>
                {messages.length > 0 && (
                    <button
                        onClick={clearChat}
                        className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition"
                        title="Clear chat"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-4">
                {/* Welcome message if empty */}
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-safari-500 to-safari-700 flex items-center justify-center mb-4 animate-pulse-glow">
                            <Bus className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-xl font-bold text-white mb-2">Karibu! 👋</h2>
                        <p className="text-slate-400 max-w-md mb-6">
                            I'm SafaRi AI, your Nairobi transport assistant. Ask me about matatu routes, traffic, fares, or anything transport-related!
                        </p>
                        <div className="flex flex-wrap justify-center gap-2">
                            {[
                                "How do I get from Westlands to CBD?",
                                "What's the fare from Rongai to town?",
                                "Ni matatu gani ya kwenda JKIA?",
                                "Is Thika Road busy right now?",
                            ].map((suggestion) => (
                                <button
                                    key={suggestion}
                                    onClick={() => {
                                        setInput(suggestion);
                                        inputRef.current?.focus();
                                    }}
                                    className="px-4 py-2 text-xs sm:text-sm glass-card hover:bg-slate-800/80 text-slate-300 transition-all hover:scale-[1.02]"
                                >
                                    {suggestion}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Message bubbles */}
                {messages.map((msg, i) => (
                    <div
                        key={i}
                        className={`flex gap-3 animate-fade-in-up ${msg.role === "user" ? "justify-end" : "justify-start"
                            }`}
                    >
                        {msg.role === "model" && (
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-safari-500 to-safari-700 flex items-center justify-center flex-shrink-0 mt-1">
                                <Bot className="w-4 h-4 text-white" />
                            </div>
                        )}

                        <div
                            className={`max-w-[80%] sm:max-w-[70%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${msg.role === "user"
                                    ? "bg-gradient-to-r from-safari-600 to-safari-500 text-white rounded-br-md"
                                    : "glass-card text-slate-200 rounded-bl-md"
                                }`}
                        >
                            <div className="whitespace-pre-wrap markdown-content">{msg.text}</div>
                            <p
                                className={`text-[10px] mt-1.5 ${msg.role === "user" ? "text-safari-200/60" : "text-slate-500"
                                    }`}
                            >
                                {msg.timestamp.toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </p>
                        </div>

                        {msg.role === "user" && (
                            <div className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center flex-shrink-0 mt-1">
                                <User className="w-4 h-4 text-slate-300" />
                            </div>
                        )}
                    </div>
                ))}

                {/* Typing indicator */}
                {loading && (
                    <div className="flex gap-3 justify-start animate-fade-in-up">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-safari-500 to-safari-700 flex items-center justify-center flex-shrink-0">
                            <Bot className="w-4 h-4 text-white" />
                        </div>
                        <div className="glass-card px-4 py-3 rounded-2xl rounded-bl-md">
                            <div className="flex gap-1.5">
                                <div className="w-2 h-2 rounded-full bg-safari-500 animate-bounce" style={{ animationDelay: "0ms" }} />
                                <div className="w-2 h-2 rounded-full bg-safari-500 animate-bounce" style={{ animationDelay: "150ms" }} />
                                <div className="w-2 h-2 rounded-full bg-safari-500 animate-bounce" style={{ animationDelay: "300ms" }} />
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="glass-card rounded-none border-x-0 border-b-0 px-4 sm:px-6 py-4">
                <div className="max-w-4xl mx-auto flex gap-3">
                    <input
                        ref={inputRef}
                        id="chat-input"
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask about routes, fares, traffic... (English or Swahili)"
                        disabled={loading}
                        className="flex-1 px-4 py-3 bg-slate-800/60 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-safari-500/50 focus:ring-2 focus:ring-safari-500/20 transition-all disabled:opacity-50"
                    />
                    <button
                        id="send-message-btn"
                        onClick={handleSend}
                        disabled={loading || !input.trim()}
                        className="px-4 py-3 bg-gradient-to-r from-safari-500 to-safari-600 text-white rounded-xl shadow-lg shadow-safari-500/25 hover:shadow-safari-500/40 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
