"use client";

import { useState } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserPlus, UserMinus, User, Mail, X } from "lucide-react";
import { toast } from "sonner";
import { getTechniciansByIds, getAvailableTechnicians } from "@/data/sites.data";

interface SiteTechniciansProps {
    siteId: string;
    assignedTechnicians: string[];
    onAssign: (userId: string) => void;
    onRevoke: (userId: string) => void;
}

export function SiteTechnicians({
    siteId,
    assignedTechnicians,
    onAssign,
    onRevoke,
}: SiteTechniciansProps) {
    const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
    const [selectedTechnician, setSelectedTechnician] = useState<string>("");
    const [revokeTarget, setRevokeTarget] = useState<string | null>(null);

    const assigned = getTechniciansByIds(assignedTechnicians);
    const available = getAvailableTechnicians(assignedTechnicians);

    const handleAssign = () => {
        if (!selectedTechnician) {
            toast.error("Please select a technician");
            return;
        }
        onAssign(selectedTechnician);
        toast.success("Technician assigned successfully");
        setIsAssignDialogOpen(false);
        setSelectedTechnician("");
    };

    const handleRevoke = (userId: string) => {
        onRevoke(userId);
        toast.success("Technician revoked successfully");
        setRevokeTarget(null);
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Technicians</CardTitle>
                <Button
                    size="sm"
                    onClick={() => setIsAssignDialogOpen(true)}
                    disabled={available.length === 0}
                >
                    <UserPlus className="mr-2 h-4 w-4" />
                    Assign
                </Button>
            </CardHeader>
            <CardContent>
                {assigned.length === 0 ? (
                    <div className="text-center py-6 text-sm text-slate-400">
                        No technicians assigned
                    </div>
                ) : (
                    <div className="space-y-2">
                        {assigned.map((tech) => (
                            <div
                                key={tech.id}
                                className="flex items-center justify-between rounded-lg border p-3"
                            >
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-8 w-8">
                                        <AvatarFallback className="bg-emerald-100 text-emerald-600 dark:bg-emerald-900 dark:text-emerald-400">
                                            {tech.name
                                                .split(" ")
                                                .map((n) => n[0])
                                                .join("")}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="text-sm font-medium">{tech.name}</p>
                                        <p className="text-xs text-slate-400">{tech.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge variant="outline" className="text-xs">
                                        {tech.role.replace("_", " ")}
                                    </Badge>
                                    <Button
                                        variant="ghost"
                                        size="icon-sm"
                                        className="h-7 w-7 text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950"
                                        onClick={() => setRevokeTarget(tech.id)}
                                    >
                                        <UserMinus className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>

            {/* Assign Dialog */}
            <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Assign Technician</DialogTitle>
                        <DialogDescription>
                            Select a technician to assign to this site
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        {available.length === 0 ? (
                            <p className="text-sm text-slate-400">
                                No available technicians to assign
                            </p>
                        ) : (
                            <Select
                                value={selectedTechnician}
                                onValueChange={setSelectedTechnician}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a technician" />
                                </SelectTrigger>
                                <SelectContent>
                                    {available.map((tech) => (
                                        <SelectItem key={tech.id} value={tech.id}>
                                            <div className="flex items-center gap-2">
                                                <span>{tech.name}</span>
                                                <Badge variant="outline" className="text-xs">
                                                    {tech.role.replace("_", " ")}
                                                </Badge>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsAssignDialogOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleAssign}
                            disabled={!selectedTechnician || available.length === 0}
                        >
                            <UserPlus className="mr-2 h-4 w-4" />
                            Assign
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Revoke Confirm Dialog */}
            <Dialog
                open={!!revokeTarget}
                onOpenChange={() => setRevokeTarget(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Revoke Technician</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to revoke this technician from the site?
                        </DialogDescription>
                    </DialogHeader>
                    {revokeTarget && (
                        <div className="flex items-center gap-3 rounded-lg border p-3">
                            <Avatar className="h-10 w-10">
                                <AvatarFallback className="bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400">
                                    {getTechniciansByIds([revokeTarget])[0]?.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-medium">
                                    {getTechniciansByIds([revokeTarget])[0]?.name}
                                </p>
                                <p className="text-xs text-slate-400">
                                    {getTechniciansByIds([revokeTarget])[0]?.email}
                                </p>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setRevokeTarget(null)}>
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => revokeTarget && handleRevoke(revokeTarget)}
                        >
                            <UserMinus className="mr-2 h-4 w-4" />
                            Revoke
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
    );
}