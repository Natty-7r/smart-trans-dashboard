"use client";

import { getCurrentUser, signOutAction } from "@/lib/actions/auth.action";
import { User } from "@/types/auth.type";
import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    signOut: () => Promise<void>;
    refetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchUser = async () => {
        try {
            const user = await getCurrentUser();
            setUser(user);
        } catch (error) {
            console.error("Error fetching user:", error);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const signOut = async () => {
        await signOutAction();
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                signOut,
                refetchUser: fetchUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}