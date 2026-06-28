"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getSiteById, DEMO_ACTIVITY_LOGS } from "@/data/sites.data";
import { SiteDetail, ActivityLogEntry } from "@/types/site.type";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, RefreshCw } from "lucide-react";
import { SiteDetailOverview } from "@/components/sites/site-detail-overview";
import { SiteTechnicians } from "@/components/sites/site-technicians";
import { SiteMaintenanceHistory } from "@/components/sites/site-maintenance-history";
import { SiteActivityLog } from "@/components/sites/site-activity-log";
import { SiteTransformersList } from "@/components/sites/site-transformers-list";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SiteDetailPage() {
    const params = useParams();
    const router = useRouter();
    const siteId = params.id as string;

    const [site, setSite] = useState<SiteDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        const loadSite = async () => {
            setIsLoading(true);
            try {
                const found = getSiteById(siteId);
                if (found) {
                    // Add activity logs with correct type
                    const activityLogs = (DEMO_ACTIVITY_LOGS[siteId] || []) as ActivityLogEntry[];
                    setSite({
                        ...found,
                        activityLog: activityLogs,
                    } as SiteDetail);
                } else {
                    toast.error("Site not found");
                    router.push("/sites");
                }
            } catch (error) {
                toast.error("Failed to load site details");
            } finally {
                setIsLoading(false);
            }
        };

        loadSite();
    }, [siteId, router]);

    const handleAssignTechnician = (userId: string) => {
        if (!site) return;
        setIsUpdating(true);
        try {
            const newActivity: ActivityLogEntry = {
                id: `act-${Date.now()}`,
                type: "technician_assigned",
                message: `Technician assigned to site`,
                timestamp: new Date().toISOString(),
                userId: "user-001",
                userName: "System",
                metadata: { technicianId: userId },
            };

            const updated: SiteDetail = {
                ...site,
                technicians: [...site.technicians, userId],
                activityLog: [newActivity, ...site.activityLog],
            };
            setSite(updated);
            toast.success("Technician assigned successfully");
        } catch (error) {
            toast.error("Failed to assign technician");
        } finally {
            setIsUpdating(false);
        }
    };

    const handleRevokeTechnician = (userId: string) => {
        if (!site) return;
        setIsUpdating(true);
        try {
            const newActivity: ActivityLogEntry = {
                id: `act-${Date.now()}`,
                type: "technician_revoked",
                message: `Technician revoked from site`,
                timestamp: new Date().toISOString(),
                userId: "user-001",
                userName: "System",
                metadata: { technicianId: userId },
            };

            const updated: SiteDetail = {
                ...site,
                technicians: site.technicians.filter((id) => id !== userId),
                activityLog: [newActivity, ...site.activityLog],
            };
            setSite(updated);
            toast.success("Technician revoked successfully");
        } catch (error) {
            toast.error("Failed to revoke technician");
        } finally {
            setIsUpdating(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-[calc(100vh-10rem)] items-center justify-center">
                <div className="text-center">
                    <RefreshCw className="mx-auto h-8 w-8 animate-spin text-emerald-600" />
                    <p className="mt-2 text-sm text-slate-500">Loading site details...</p>
                </div>
            </div>
        );
    }

    if (!site) {
        return (
            <div className="flex h-[calc(100vh-10rem)] items-center justify-center">
                <div className="text-center">
                    <p className="text-slate-500">Site not found</p>
                    <Button onClick={() => router.push("/sites")} className="mt-4">
                        Back to Sites
                    </Button>
                </div>
            </div>
        );
    }

    // Prepare transformer data for the list
    const transformerData = site.transformers.map((id) => ({
        id,
        type: "25KVA",
        status: site.status,
        healthScore: site.healthScore,
    }));

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.push("/sites")}
                        className="h-8 w-8"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">{site.name}</h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            {site.code} · {site.location.district}, {site.location.region}
                        </p>
                    </div>
                </div>
                <Button variant="outline" size="sm">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Site
                </Button>
            </div>

            {/* Overview */}
            <SiteDetailOverview site={site} />

            {/* Tabs */}
            <Tabs defaultValue="technicians" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="technicians">Technicians</TabsTrigger>
                    <TabsTrigger value="transformers">Transformers</TabsTrigger>
                    <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
                    <TabsTrigger value="activity">Activity Log</TabsTrigger>
                </TabsList>

                <TabsContent value="technicians">
                    <SiteTechnicians
                        siteId={site.id}
                        assignedTechnicians={site.technicians}
                        onAssign={handleAssignTechnician}
                        onRevoke={handleRevokeTechnician}
                    />
                </TabsContent>

                <TabsContent value="transformers">
                    <SiteTransformersList transformers={transformerData} />
                </TabsContent>

                <TabsContent value="maintenance">
                    <SiteMaintenanceHistory
                        maintenance={site.maintenance}
                        onAddMaintenance={() => {
                            toast.info("Add maintenance feature coming soon");
                        }}
                    />
                </TabsContent>

                <TabsContent value="activity">
                    <SiteActivityLog activities={site.activityLog || []} />
                </TabsContent>
            </Tabs>
        </div>
    );
}