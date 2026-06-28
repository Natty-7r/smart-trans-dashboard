"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface UseSocketOptions {
    url?: string;
    autoConnect?: boolean;
    onMessage?: (data: any) => void;
    onConnect?: () => void;
    onDisconnect?: () => void;
    onError?: (error: Event) => void;
}

interface UseSocketReturn {
    isConnected: boolean;
    isConnecting: boolean;
    error: Event | null;
    sendMessage: (data: any) => void;
    connect: () => void;
    disconnect: () => void;
    reconnect: () => void;
}

// Mock WebSocket for demo (since we don't have a real backend)
class MockWebSocket {
    private listeners: { [key: string]: ((data: any) => void)[] } = {};
    public readyState: number = 0;
    public onopen: (() => void) | null = null;
    public onclose: (() => void) | null = null;
    public onmessage: ((data: any) => void) | null = null;
    public onerror: ((error: Event) => void) | null = null;

    constructor(url: string) {
        // Simulate connection
        setTimeout(() => {
            this.readyState = 1;
            if (this.onopen) this.onopen();
            // Simulate incoming messages
            this.startSimulation();
        }, 500);
    }

    private startSimulation() {
        let counter = 0;
        const interval = setInterval(() => {
            if (this.readyState !== 1) {
                clearInterval(interval);
                return;
            }
            counter++;
            // Simulate random telemetry update
            const data = {
                type: "telemetry_update",
                siteId: ["ADD-001", "ADD-042", "ADD-087", "ADD-103", "ADD-056"][
                    Math.floor(Math.random() * 5)
                ],
                timestamp: new Date().toISOString(),
                readings: {
                    temp: 65 + Math.random() * 35,
                    current: 100 + Math.random() * 80,
                    oil: 50 + Math.random() * 50,
                    gas: 5 + Math.random() * 100,
                },
            };
            if (this.onmessage) {
                this.onmessage({ data: JSON.stringify(data) });
            }
        }, 10000);

        // Store interval for cleanup
        (this as any)._interval = interval;
    }

    send(data: string) {
        // Mock send
        console.log("Mock WebSocket send:", data);
    }

    close() {
        this.readyState = 3;
        if (this.onclose) this.onclose();
        if ((this as any)._interval) {
            clearInterval((this as any)._interval);
        }
    }

    addEventListener(event: string, callback: (data: any) => void) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
    }

    removeEventListener(event: string, callback: (data: any) => void) {
        if (this.listeners[event]) {
            this.listeners[event] = this.listeners[event].filter(
                (cb) => cb !== callback
            );
        }
    }
}

export function useSocket({
    url = "wss://api.smarttrans.com/ws",
    autoConnect = true,
    onMessage,
    onConnect,
    onDisconnect,
    onError,
}: UseSocketOptions = {}): UseSocketReturn {
    const [isConnected, setIsConnected] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const [error, setError] = useState<Event | null>(null);
    const wsRef = useRef<MockWebSocket | null>(null);

    const connect = useCallback(() => {
        if (wsRef.current?.readyState === 1) return;

        setIsConnecting(true);
        setError(null);

        try {
            // Use mock WebSocket for demo
            const ws = new MockWebSocket(url);
            wsRef.current = ws;

            ws.onopen = () => {
                setIsConnected(true);
                setIsConnecting(false);
                if (onConnect) onConnect();
                console.log("WebSocket connected");
            };

            ws.onclose = () => {
                setIsConnected(false);
                setIsConnecting(false);
                if (onDisconnect) onDisconnect();
                console.log("WebSocket disconnected");
            };

            ws.onmessage = (event: any) => {
                try {
                    const data = JSON.parse(event.data);
                    if (onMessage) onMessage(data);
                } catch (err) {
                    console.error("Failed to parse WebSocket message:", err);
                }
            };

            ws.onerror = (err: Event) => {
                setError(err);
                setIsConnected(false);
                setIsConnecting(false);
                if (onError) onError(err);
                console.error("WebSocket error:", err);
            };
        } catch (err) {
            setError(err as Event);
            setIsConnecting(false);
            console.error("Failed to create WebSocket:", err);
        }
    }, [url, onConnect, onDisconnect, onError, onMessage]);

    const disconnect = useCallback(() => {
        if (wsRef.current) {
            wsRef.current.close();
            wsRef.current = null;
        }
        setIsConnected(false);
        setIsConnecting(false);
    }, []);

    const reconnect = useCallback(() => {
        disconnect();
        setTimeout(connect, 1000);
    }, [disconnect, connect]);

    const sendMessage = useCallback(
        (data: any) => {
            if (wsRef.current?.readyState === 1) {
                wsRef.current.send(JSON.stringify(data));
            } else {
                console.warn("WebSocket not connected, message not sent");
            }
        },
        []
    );

    useEffect(() => {
        if (autoConnect) {
            connect();
        }

        return () => {
            disconnect();
        };
    }, [autoConnect, connect, disconnect]);

    return {
        isConnected,
        isConnecting,
        error,
        sendMessage,
        connect,
        disconnect,
        reconnect,
    };
}