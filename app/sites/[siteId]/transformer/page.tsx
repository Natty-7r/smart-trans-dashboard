"use client";

import { TrafficLightIndicator } from "@/components/dashboard/traffic-light-indicator";
import { TransformerActionLog } from "@/components/tranformer/transformer-action-log";
import { TransformerAIAnalytics } from "@/components/tranformer/transformer-ai-analytics";
import { TransformerForm } from "@/components/tranformer/transformer-form";
import { TransformerGauges } from "@/components/tranformer/transformer-gauges";
import { TransformerOverview } from "@/components/tranformer/transformer-overview";
import { TransformerReadingHistory } from "@/components/tranformer/transformer-reading-history";
import { TransformerTechnicians } from "@/components/tranformer/transformer-technicians";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getTransformerBySiteId } from "@/data/transformer.data";
import { useIsMobile } from "@/hooks/use-mobile";
import { Transformer } from "@/types/transformer.type";
import { formatTimeAgo } from "@/utils/transformer.utils";
import { ArrowLeft, Edit, RefreshCw } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function TransformerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const isMobile = useIsMobile();
  const siteId = params.siteId as string;

  const [transformer, setTransformer] = useState<Transformer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);

  useEffect(() => {
    const loadTransformer = async () => {
      setIsLoading(true);
      try {
        const found = getTransformerBySiteId(siteId);
        if (found) {
          setTransformer(found);
        } else {
          toast.error("Transformer not found for this site");
          router.push(`/sites/${siteId}`);
        }
      } catch (error) {
        toast.error("Failed to load transformer details");
      } finally {
        setIsLoading(false);
      }
    };

    loadTransformer();
  }, [siteId, router]);

  const handleRefresh = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const found = getTransformerBySiteId(siteId);
    if (found) setTransformer(found);
    setIsLoading(false);
    toast.success("Refreshed");
  };

  const handleUpdateTransformer = (data: any) => {
    if (transformer) {
      const updated = {
        ...transformer,
        ...data,
        lastUpdated: new Date().toISOString(),
      };
      setTransformer(updated);
      toast.success("Transformer updated successfully");
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-10rem)] items-center justify-center">
        <div className="text-center">
          <RefreshCw className="mx-auto h-8 w-8 animate-spin text-emerald-600" />
          <p className="mt-2 text-sm text-slate-500">
            Loading transformer details...
          </p>
        </div>
      </div>
    );
  }

  if (!transformer) {
    return (
      <div className="flex h-[calc(100vh-10rem)] items-center justify-center">
        <div className="text-center">
          <p className="text-slate-500">Transformer not found</p>
          <Button onClick={() => router.back()} className="mt-4">
            Back to Site
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <Button
            variant="ghost"
            size={isMobile ? "icon-sm" : "icon"}
            onClick={() => router.back()}
            className="h-8 w-8 shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg font-bold md:text-2xl">
                {transformer.id}
              </h1>
              <Badge variant="outline" className="text-xs">
                {transformer.type}
              </Badge>
              <TrafficLightIndicator status={transformer.status} size="sm" />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 md:text-sm">
              {transformer.siteName} ({transformer.siteCode}) ·{" "}
              {transformer.location.district}, {transformer.location.region}
            </p>
            <p className="text-xs text-slate-400">
              Last updated: {formatTimeAgo(transformer.lastUpdated)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size={isMobile ? "sm" : "default"}
            onClick={handleRefresh}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button
            size={isMobile ? "sm" : "default"}
            onClick={() => setIsEditOpen(true)}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <TransformerOverview transformer={transformer} />

      {/* Live Gauges */}
      <TransformerGauges
        readings={transformer.readings[transformer.readings.length - 1]}
        transformer={transformer}
      />

      {/* Tabs */}
      <Tabs defaultValue="readings" className="space-y-4">
        <div className="overflow-x-auto pb-2">
          <TabsList className="inline-flex w-auto min-w-full sm:min-w-0">
            <TabsTrigger value="readings" className="text-xs md:text-sm">
              Reading History
            </TabsTrigger>
            <TabsTrigger value="actions" className="text-xs md:text-sm">
              Action Log
            </TabsTrigger>
            <TabsTrigger value="analytics" className="text-xs md:text-sm">
              AI Analytics
            </TabsTrigger>
            <TabsTrigger value="technicians" className="text-xs md:text-sm">
              Technicians
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="readings">
          <TransformerReadingHistory
            readings={transformer.readings}
            transformerId={transformer.id}
          />
        </TabsContent>

        <TabsContent value="actions">
          <TransformerActionLog
            maintenance={transformer.maintenance}
            transformerId={transformer.id}
          />
        </TabsContent>

        <TabsContent value="analytics">
          <TransformerAIAnalytics
            transformer={transformer}
            readings={transformer.readings}
          />
        </TabsContent>

        <TabsContent value="technicians">
          <TransformerTechnicians
            transformerId={transformer.id}
            assignedTechnicians={transformer.technicians}
          />
        </TabsContent>
      </Tabs>

      {/* Edit Dialog */}
      <TransformerForm
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        transformer={transformer}
        onSuccess={handleUpdateTransformer}
        mode="edit"
      />
    </div>
  );
}
