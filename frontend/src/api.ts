const API_BASE = "/api";

export interface RouteResponse {
    origin: string;
    destination: string;
    advice: string;
}

export interface HazardResponse {
    analysis: string;
    image_received: boolean;
}

export interface ChatResponse {
    response: string;
}

export interface ChatMessage {
    role: "user" | "model";
    text: string;
}

export async function findRoute(
    origin: string,
    destination: string
): Promise<RouteResponse> {
    const res = await fetch(`${API_BASE}/route`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ origin, destination }),
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to find route");
    }
    return res.json();
}

export async function reportHazard(imageFile: File): Promise<HazardResponse> {
    const formData = new FormData();
    formData.append("image", imageFile);

    const res = await fetch(`${API_BASE}/hazard`, {
        method: "POST",
        body: formData,
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to analyze hazard");
    }
    return res.json();
}

export async function sendChatMessage(
    message: string,
    history: ChatMessage[]
): Promise<ChatResponse> {
    const res = await fetch(`${API_BASE}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, history }),
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to send message");
    }
    return res.json();
}
