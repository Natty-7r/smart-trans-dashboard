"use client";

import { Logo } from "@/components/common/logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Bell, Menu, Search, Settings, User, X } from "lucide-react";
import { useEffect, useState } from "react";

interface HeaderProps {
    isMobile?: boolean;
    onMenuClick?: () => void;
    isSidebarOpen?: boolean;
}

export function Header({ isMobile = false, onMenuClick, isSidebarOpen = false }: HeaderProps) {
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    // Close search on escape
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isSearchOpen) {
                setIsSearchOpen(false);
            }
        };
        window.addEventListener("keydown", handleEscape);
        return () => window.removeEventListener("keydown", handleEscape);
    }, [isSearchOpen]);

    return (
        <header className="flex h-14 items-center border-b bg-white px-3 dark:bg-slate-950 md:h-16 md:px-4">
            {/* Mobile menu button */}
            {isMobile && (
                <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={onMenuClick}
                    className="mr-2"
                    aria-label="Toggle menu"
                >
                    {isSidebarOpen ? (
                        <X className="h-5 w-5" />
                    ) : (
                        <Menu className="h-5 w-5" />
                    )}
                </Button>
            )}

            {/* Logo (visible on mobile when sidebar is closed) */}
            {isMobile && !isSidebarOpen && (
                <div className="mr-2">
                    <Logo variant="icon" size="sm" href="/" />
                </div>
            )}

            {/* Search - Desktop */}
            <div className="hidden flex-1 items-center gap-4 md:flex">
                <div className="relative w-96">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                        placeholder="Search sites, alerts, or reports..."
                        className="pl-9"
                    />
                </div>
            </div>

            {/* Search - Mobile */}
            {isMobile && (
                <div className="flex flex-1 items-center justify-end gap-2">
                    {isSearchOpen ? (
                        <div className="relative flex-1 animate-in slide-in-from-right-4 duration-200">
                            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                            <Input
                                placeholder="Search..."
                                className="h-8 pl-8 text-sm"
                                autoFocus
                                onBlur={() => setIsSearchOpen(false)}
                            />
                        </div>
                    ) : (
                        <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => setIsSearchOpen(true)}
                            className="md:hidden"
                            aria-label="Search"
                        >
                            <Search className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            )}

            {/* Right side */}
            <div className="flex items-center gap-2 md:gap-4">
                {/* Status - Desktop */}
                <Badge variant="outline" className="hidden sm:flex">
                    <span className="mr-1 h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                    523 Sites Online
                </Badge>

                {/* Status - Mobile (minimal) */}
                <Badge variant="outline" className="sm:hidden px-1.5 py-0 text-[10px]">
                    <span className="mr-1 h-1 w-1 rounded-full bg-emerald-500"></span>
                    523
                </Badge>

                {/* Notifications */}
                <Button variant="ghost" size="icon-sm" className="relative">
                    <Bell className="h-4 w-4 md:h-5 md:w-5" />
                    <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-500 text-[8px] font-bold text-white md:h-4 md:w-4 md:text-[10px]">
                        3
                    </span>
                </Button>

                {/* User dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-sm" className="rounded-full">
                            <User className="h-4 w-4 md:h-5 md:w-5" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <Settings className="mr-2 h-4 w-4" />
                            Settings
                        </DropdownMenuItem>
                        <DropdownMenuItem>Profile</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">Logout</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}