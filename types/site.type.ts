// ============================================================
// SITE TYPES
// ============================================================

export type SiteStatus = "nominal" | "alarm" | "critical";

export interface SiteLocation {
    continent: string;
    country: string;
    region: string;
    district: string;
    specificLocation: string;
    latitude: number;
    longitude: number;
}

export interface MaintenanceRecord {
    id: string;
    date: string;
    technicianId: string;
    technicianName: string;
    tasks: string[];
    notes?: string;
}

export interface Site {
    id: string;
    name: string;
    code: string;
    location: SiteLocation;
    transformers: string[]; // transformer IDs
    technicians: string[]; // technician user IDs
    plantedDate: string; // installation date
    status: SiteStatus;
    healthScore: number;
    maintenance: MaintenanceRecord[];
    activeAlerts: number;
    lastUpdated: string;
    image?: string;
}

// ============================================================
// SITE FILTERS
// ============================================================

export interface SiteFilters {
    search?: string;
    status?: SiteStatus | "all";
    continent?: string;
    country?: string;
    region?: string;
    district?: string;
    transformerType?: string;
}

// ============================================================
// SITE FORM DATA
// ============================================================

export interface SiteFormData {
    name: string;
    code: string;
    location: {
        continent: string;
        country: string;
        region: string;
        district: string;
        specificLocation: string;
        latitude: number;
        longitude: number;
    };
    plantedDate: string;
    transformers: string[];
}

// ============================================================
// SITE PREVIEW (for map/table)
// ============================================================

export interface SitePreview {
    id: string;
    name: string;
    code: string;
    status: SiteStatus;
    healthScore: number;
    activeAlerts: number;
    location: {
        latitude: number;
        longitude: number;
        district: string;
        region: string;
    };
    transformerCount: number;
    technicianCount: number;
}



// ... existing types ...

// ============================================================
// SITE DETAIL TYPES
// ============================================================

export interface SiteDetail extends Site {
    maintenance: MaintenanceRecord[];
    activityLog: ActivityLogEntry[];
}

export interface ActivityLogEntry {
    id: string;
    type: "maintenance" | "alert" | "technician_assigned" | "technician_revoked" | "status_change" | "transformer_added" | "transformer_removed";
    message: string;
    timestamp: string;
    userId: string;
    userName: string;
    metadata?: Record<string, any>;
}

export interface TechnicianAssignment {
    userId: string;
    userName: string;
    userEmail: string;
    userRole: string;
    assignedAt: string;
    assignedBy: string;
}