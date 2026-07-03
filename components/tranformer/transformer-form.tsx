"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Transformer, TransformerFormData, TransformerType } from "@/types/transformer.type";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface TransformerFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    transformer?: Transformer;
    onSuccess?: (data: any) => void;
    mode: "add" | "edit";
    siteId?: string;
    siteName?: string;
}

export function TransformerForm({
    open,
    onOpenChange,
    transformer,
    onSuccess,
    mode,
    siteId,
    siteName,
}: TransformerFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<TransformerFormData>({
        siteId: siteId || transformer?.siteId || "",
        type: transformer?.type || "25KVA",
        manufacturer: transformer?.manufacturer || "",
        model: transformer?.model || "",
        serialNumber: transformer?.serialNumber || "",
        capacity: transformer?.capacity || 25,
        installedDate: transformer?.installedDate
            ? new Date(transformer.installedDate).toISOString().split("T")[0]
            : "",
        expectedLife: transformer?.expectedLife || 20,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Validate
            if (!formData.manufacturer || !formData.model) {
                toast.error("Please fill in all required fields");
                setIsLoading(false);
                return;
            }

            await new Promise((resolve) => setTimeout(resolve, 1000));

            if (onSuccess) {
                onSuccess(formData);
            }
            toast.success(`Transformer ${mode === "add" ? "added" : "updated"} successfully`);
            onOpenChange(false);
        } catch (error) {
            toast.error(`Failed to ${mode} transformer`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl md:min-w-[600px] p-4 md:p-8 max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{mode === "add" ? "Add New Transformer" : "Edit Transformer"}</DialogTitle>
                    <DialogDescription>
                        {mode === "add"
                            ? `Add a new transformer to site: ${siteName || siteId}`
                            : "Update the transformer details"}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Site info (read-only for add mode) */}
                    {mode === "add" && siteName && (
                        <div className="rounded-lg bg-slate-50 p-3 text-sm dark:bg-slate-800">
                            <span className="text-slate-500">Site: </span>
                            <span className="font-medium">{siteName}</span>
                            <span className="ml-2 text-slate-400">({siteId})</span>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="type">Transformer Type *</Label>
                            <Select
                                value={formData.type}
                                onValueChange={(value) =>
                                    setFormData({ ...formData, type: value as TransformerType })
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="25KVA">25 KVA</SelectItem>
                                    <SelectItem value="50KVA">50 KVA</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="capacity">Capacity (KVA) *</Label>
                            <Input
                                id="capacity"
                                type="number"
                                value={formData.capacity}
                                onChange={(e) =>
                                    setFormData({ ...formData, capacity: parseFloat(e.target.value) })
                                }
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="manufacturer">Manufacturer *</Label>
                            <Input
                                id="manufacturer"
                                placeholder="e.g., Siemens, ABB"
                                value={formData.manufacturer}
                                onChange={(e) =>
                                    setFormData({ ...formData, manufacturer: e.target.value })
                                }
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="model">Model *</Label>
                            <Input
                                id="model"
                                placeholder="e.g., T-1000"
                                value={formData.model}
                                onChange={(e) =>
                                    setFormData({ ...formData, model: e.target.value })
                                }
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="serialNumber">Serial Number</Label>
                            <Input
                                id="serialNumber"
                                placeholder="e.g., SN-12345678"
                                value={formData.serialNumber}
                                onChange={(e) =>
                                    setFormData({ ...formData, serialNumber: e.target.value })
                                }
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="installedDate">Installation Date</Label>
                            <Input
                                id="installedDate"
                                type="date"
                                value={formData.installedDate}
                                onChange={(e) =>
                                    setFormData({ ...formData, installedDate: e.target.value })
                                }
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="expectedLife">Expected Life (years)</Label>
                        <Input
                            id="expectedLife"
                            type="number"
                            value={formData.expectedLife}
                            onChange={(e) =>
                                setFormData({ ...formData, expectedLife: parseFloat(e.target.value) })
                            }
                        />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    {mode === "add" ? "Adding..." : "Saving..."}
                                </>
                            ) : (
                                mode === "add" ? "Add Transformer" : "Save Changes"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}