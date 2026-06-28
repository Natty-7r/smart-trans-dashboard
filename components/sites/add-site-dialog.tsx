"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { SiteFormData } from "@/types/site.type";
import { toast } from "sonner";
import { MapPin, Loader2 } from "lucide-react";

interface AddSiteDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
}

const defaultLocation = {
    continent: "Africa",
    country: "Ethiopia",
    region: "",
    district: "",
    specificLocation: "",
    latitude: 9.03,
    longitude: 38.74,
};

export function AddSiteDialog({ open, onOpenChange, onSuccess }: AddSiteDialogProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<SiteFormData>({
        name: "",
        code: "",
        location: defaultLocation,
        plantedDate: "",
        transformers: [],
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Validate
            if (!formData.name || !formData.code || !formData.location.region) {
                toast.error("Please fill in all required fields");
                setIsLoading(false);
                return;
            }

            // In real app, this would be an API call
            // const result = await addSiteAction(formData);

            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1500));

            toast.success(`Site "${formData.name}" added successfully!`);
            onOpenChange(false);
            if (onSuccess) onSuccess();

            // Reset form
            setFormData({
                name: "",
                code: "",
                location: defaultLocation,
                plantedDate: "",
                transformers: [],
            });
        } catch (error) {
            toast.error("Failed to add site. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleLocationChange = (field: string, value: any) => {
        setFormData((prev) => ({
            ...prev,
            location: { ...prev.location, [field]: value },
        }));
    };

    const handleMapClick = () => {
        // In real app, open map selection
        // For demo, set a random location
        const randomLat = 8.9 + Math.random() * 0.3;
        const randomLng = 38.6 + Math.random() * 0.4;
        setFormData((prev) => ({
            ...prev,
            location: {
                ...prev.location,
                latitude: randomLat,
                longitude: randomLng,
            },
        }));
        toast.info("Map location updated");
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl">Add New Site</DialogTitle>
                    <p className="text-sm text-slate-500">Enter the details of the new transformer site</p>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Basic Info */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Site Name *</Label>
                            <Input
                                id="name"
                                placeholder="e.g., Bole Site C"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="code">Site Code *</Label>
                            <Input
                                id="code"
                                placeholder="e.g., ADD-202"
                                value={formData.code}
                                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                required
                            />
                        </div>
                    </div>

                    {/* Planted Date */}
                    <div className="space-y-2">
                        <Label htmlFor="plantedDate">Installation Date</Label>
                        <Input
                            id="plantedDate"
                            type="date"
                            value={formData.plantedDate}
                            onChange={(e) => setFormData({ ...formData, plantedDate: e.target.value })}
                        />
                    </div>

                    {/* Location */}
                    <div className="space-y-2">
                        <Label>Location Details</Label>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <Input
                                    placeholder="Continent"
                                    value={formData.location.continent}
                                    onChange={(e) => handleLocationChange("continent", e.target.value)}
                                />
                            </div>
                            <div>
                                <Input
                                    placeholder="Country"
                                    value={formData.location.country}
                                    onChange={(e) => handleLocationChange("country", e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <Input
                                placeholder="Region *"
                                value={formData.location.region}
                                onChange={(e) => handleLocationChange("region", e.target.value)}
                                required
                            />
                            <Input
                                placeholder="District"
                                value={formData.location.district}
                                onChange={(e) => handleLocationChange("district", e.target.value)}
                            />
                        </div>
                        <Textarea
                            placeholder="Specific location description"
                            value={formData.location.specificLocation}
                            onChange={(e) => handleLocationChange("specificLocation", e.target.value)}
                            className="resize-none"
                        />
                    </div>

                    {/* GPS Coordinates */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label>GPS Coordinates</Label>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={handleMapClick}
                            >
                                <MapPin className="mr-2 h-4 w-4" />
                                Select on Map
                            </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <Input
                                type="number"
                                step="any"
                                placeholder="Latitude"
                                value={formData.location.latitude}
                                onChange={(e) => handleLocationChange("latitude", parseFloat(e.target.value))}
                            />
                            <Input
                                type="number"
                                step="any"
                                placeholder="Longitude"
                                value={formData.location.longitude}
                                onChange={(e) => handleLocationChange("longitude", parseFloat(e.target.value))}
                            />
                        </div>
                        <p className="text-xs text-slate-400">
                            Click "Select on Map" to pick location interactively
                        </p>
                    </div>

                    {/* Transformers */}
                    <div className="space-y-2">
                        <Label htmlFor="transformers">Transformer IDs (comma separated)</Label>
                        <Input
                            id="transformers"
                            placeholder="e.g., TR-009, TR-010"
                            value={formData.transformers.join(", ")}
                            onChange={(e) => {
                                const ids = e.target.value.split(",").map((s) => s.trim()).filter(Boolean);
                                setFormData({ ...formData, transformers: ids });
                            }}
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
                                    Adding...
                                </>
                            ) : (
                                "Add Site"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}