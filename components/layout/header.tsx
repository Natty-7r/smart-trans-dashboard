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
import { Bell, Menu, Search, Settings, User } from "lucide-react";

export function Header() {
    return (
        <header className="flex h-16 items-center border-b bg-white px-4 dark:bg-slate-950">
            {/* Mobile menu button */}
            <Button variant="ghost" size="icon" className="mr-2 lg:hidden">
                <Menu className="h-5 w-5" />
            </Button>

            {/* Logo (visible on mobile) */}
            <div className="lg:hidden">
                <Logo variant="icon" size="sm" href="/" />
            </div>

            {/* Search */}
            <div className="flex flex-1 items-center gap-4">
                <div className="relative hidden w-96 sm:block">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                        placeholder="Search sites, alerts, or reports..."
                        className="pl-9"
                    />
                </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-4">
                {/* Status */}
                <Badge variant="outline" className="hidden sm:flex">
                    <span className="mr-1 h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                    523 Sites Online
                </Badge>

                {/* Notifications */}
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                        3
                    </span>
                </Button>

                {/* User dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-full">
                            <User className="h-5 w-5" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
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