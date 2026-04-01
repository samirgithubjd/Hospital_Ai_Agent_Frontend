"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Vapi from "@vapi-ai/web";

export type CallStatus = "idle" | "connecting" | "active" | "ended";

export interface UseVapiReturn {
    status: CallStatus;
    isMuted: boolean;
    volumeLevel: number;
    lastError: string | null;
    assistantTalking: boolean;
    startCall: (assistantId?: string) => Promise<void>;
    endCall: () => Promise<void>;
    toggleMute: () => void;
    requestAssistantReply: () => void;
}

const VAPI_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY;
const DEFAULT_ASSISTANT_ID = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID;

export function useVapi(): UseVapiReturn {
    const vapiRef = useRef<Vapi | null>(null);
    const [status, setStatus] = useState<CallStatus>("idle");
    const [isMuted, setIsMuted] = useState(false);
    const [volumeLevel, setVolumeLevel] = useState(0);
    const [lastError, setLastError] = useState<string | null>(null);
    const [assistantTalking, setAssistantTalking] = useState(false);

    useEffect(() => {
        if (!VAPI_PUBLIC_KEY) {
            console.error("Missing NEXT_PUBLIC_VAPI_PUBLIC_KEY");
            return;
        }

        const vapi = new Vapi(VAPI_PUBLIC_KEY);
        vapiRef.current = vapi;

        const handleCallStart = () => setStatus("active");
        const handleCallStartSuccess = () => setStatus("active");
        const handleCallEnd = () => {
            setStatus("ended");
            setIsMuted(false);
            setVolumeLevel(0);
            setAssistantTalking(false);
        };
        const handleVolumeLevel = (level: number) => setVolumeLevel(level);
        const handleSpeechStart = () => setAssistantTalking(true);
        const handleSpeechEnd = () => setAssistantTalking(false);
        const handleError = (error: unknown) => {
            console.error("Vapi error:", error);
            setLastError(
                error instanceof Error ? error.message : "Vapi call failed"
            );
            setStatus("idle");
            setAssistantTalking(false);
        };

        vapi.on("call-start", handleCallStart);
        vapi.on("call-start-success", handleCallStartSuccess);
        vapi.on("call-end", handleCallEnd);
        vapi.on("volume-level", handleVolumeLevel);
        vapi.on("speech-start", handleSpeechStart);
        vapi.on("speech-end", handleSpeechEnd);
        vapi.on("error", handleError);

        return () => {
            vapi.removeAllListeners();
            void vapi.stop();
            vapiRef.current = null;
        };
    }, []);

    const startCall = useCallback(async (assistantId?: string) => {
        const vapi = vapiRef.current;
        const targetAssistantId = assistantId || DEFAULT_ASSISTANT_ID;

        if (!vapi) {
            throw new Error("Vapi is not initialized");
        }

        if (!targetAssistantId) {
            throw new Error("Missing Vapi assistant ID");
        }

        setLastError(null);
        setAssistantTalking(false);
        setVolumeLevel(0);
        setStatus("connecting");
        await vapi.start(targetAssistantId);
        vapi.send({
            type: "control",
            control: "say-first-message",
        });
    }, []);

    const endCall = useCallback(async () => {
        const vapi = vapiRef.current;

        if (!vapi) {
            setStatus("ended");
            return;
        }

        await vapi.stop();
        setStatus("ended");
        setIsMuted(false);
        setVolumeLevel(0);
        setAssistantTalking(false);
    }, []);

    const toggleMute = useCallback(() => {
        const vapi = vapiRef.current;

        if (!vapi) {
            return;
        }

        const nextMuted = !isMuted;
        vapi.setMuted(nextMuted);
        setIsMuted(nextMuted);
    }, [isMuted]);

    const requestAssistantReply = useCallback(() => {
        const vapi = vapiRef.current;

        if (!vapi) {
            return;
        }

        vapi.send({
            type: "control",
            control: "say-first-message",
        });
    }, []);

    return {
        status,
        isMuted,
        volumeLevel,
        lastError,
        assistantTalking,
        startCall,
        endCall,
        toggleMute,
        requestAssistantReply,
    };
}
