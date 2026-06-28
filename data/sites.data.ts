import { Site, MaintenanceRecord, ActivityLogEntry } from "@/types/site.type";

// ============================================================
// MAINTENANCE RECORDS
// ============================================================

const maintenanceRecords: MaintenanceRecord[] = [
    {
        id: "maint-001",
        date: "2026-05-10T09:00:00Z",
        technicianId: "user-003",
        technicianName: "Mike Field",
        tasks: ["Oil filter replacement", "Cooling system inspection", "Thermal imaging scan"],
        notes: "Oil quality good, no signs of degradation",
    },
    {
        id: "maint-002",
        date: "2026-04-15T14:30:00Z",
        technicianId: "user-003",
        technicianName: "Mike Field",
        tasks: ["Routine inspection", "Load balancing check", "Oil sample collection"],
        notes: "Load imbalance detected on Phase B, rebalancing recommended",
    },
    {
        id: "maint-003",
        date: "2026-06-01T11:00:00Z",
        technicianId: "user-004",
        technicianName: "Lisa Manager",
        tasks: ["Emergency response", "Overload mitigation", "Cooling fan replacement"],
        notes: "Cooling fan failed, replaced with new unit",
    },
    {
        id: "maint-004",
        date: "2026-03-20T10:00:00Z",
        technicianId: "user-003",
        technicianName: "Mike Field",
        tasks: ["Routine maintenance", "Oil top-up", "Gasket replacement"],
        notes: "Minor oil leak detected, gasket replaced",
    },
    {
        id: "maint-005",
        date: "2026-05-25T08:30:00Z",
        technicianId: "user-002",
        technicianName: "Sarah NOC",
        tasks: ["Diagnostic test", "Insulation resistance test", "Transformer tap check"],
        notes: "All readings within normal range",
    },
    {
        id: "maint-006",
        date: "2026-06-15T10:00:00Z",
        technicianId: "user-003",
        technicianName: "Mike Field",
        tasks: ["Routine inspection", "Oil sampling", "Thermal scan"],
        notes: "All systems nominal",
    },
    {
        id: "maint-007",
        date: "2026-05-20T09:30:00Z",
        technicianId: "user-004",
        technicianName: "Lisa Manager",
        tasks: ["Emergency repair", "Fuse replacement", "Load test"],
        notes: "Blown fuse replaced, load test passed",
    },
];

// ============================================================
// DEMO SITES — REAL WORLD DATA (Ethiopia + Other Countries)
// ============================================================

export const DEMO_SITES: Site[] = [
    // ========== ETHIOPIA SITES ==========
    {
        id: "site-001",
        name: "Bole Site A",
        code: "ADD-001",
        location: {
            continent: "Africa",
            country: "Ethiopia",
            region: "Addis Ababa",
            district: "Bole",
            specificLocation: "Bole International Airport Road",
            latitude: 9.0056,
            longitude: 38.7636,
        },
        transformers: ["TR-001", "TR-002"],
        technicians: ["user-003"],
        plantedDate: "2023-01-15T00:00:00Z",
        status: "nominal",
        healthScore: 94,
        maintenance: [maintenanceRecords[0], maintenanceRecords[1]],
        activeAlerts: 0,
        lastUpdated: new Date().toISOString(),
    },
    {
        id: "site-002",
        name: "Bole District B",
        code: "ADD-042",
        location: {
            continent: "Africa",
            country: "Ethiopia",
            region: "Addis Ababa",
            district: "Bole",
            specificLocation: "Bole Medhanialem, Behind Bole Mall",
            latitude: 9.0256,
            longitude: 38.7836,
        },
        transformers: ["TR-003"],
        technicians: ["user-003", "user-004"],
        plantedDate: "2023-03-20T00:00:00Z",
        status: "alarm",
        healthScore: 67,
        maintenance: [maintenanceRecords[2]],
        activeAlerts: 2,
        lastUpdated: new Date().toISOString(),
    },
    {
        id: "site-003",
        name: "Kirkos Tower",
        code: "ADD-087",
        location: {
            continent: "Africa",
            country: "Ethiopia",
            region: "Addis Ababa",
            district: "Kirkos",
            specificLocation: "Kirkos Subcity, Near St. George Cathedral",
            latitude: 9.0456,
            longitude: 38.8036,
        },
        transformers: ["TR-004", "TR-005"],
        technicians: ["user-003", "user-002"],
        plantedDate: "2022-06-01T00:00:00Z",
        status: "critical",
        healthScore: 34,
        maintenance: [maintenanceRecords[3]],
        activeAlerts: 3,
        lastUpdated: new Date().toISOString(),
    },
    {
        id: "site-004",
        name: "Lideta Substation",
        code: "ADD-103",
        location: {
            continent: "Africa",
            country: "Ethiopia",
            region: "Addis Ababa",
            district: "Lideta",
            specificLocation: "Lideta Subcity, Near Lideta Church",
            latitude: 9.0656,
            longitude: 38.8236,
        },
        transformers: ["TR-006"],
        technicians: ["user-004"],
        plantedDate: "2024-01-10T00:00:00Z",
        status: "nominal",
        healthScore: 91,
        maintenance: [maintenanceRecords[4]],
        activeAlerts: 0,
        lastUpdated: new Date().toISOString(),
    },
    {
        id: "site-005",
        name: "Mexico Roundabout",
        code: "ADD-056",
        location: {
            continent: "Africa",
            country: "Ethiopia",
            region: "Addis Ababa",
            district: "Mexico",
            specificLocation: "Mexico Roundabout, Near Mexico Square",
            latitude: 9.0856,
            longitude: 38.8436,
        },
        transformers: ["TR-007", "TR-008"],
        technicians: ["user-003", "user-005", "user-006"],
        plantedDate: "2023-08-15T00:00:00Z",
        status: "alarm",
        healthScore: 58,
        maintenance: [maintenanceRecords[2], maintenanceRecords[3]],
        activeAlerts: 2,
        lastUpdated: new Date().toISOString(),
    },
    {
        id: "site-006",
        name: "Arada Substation",
        code: "ADD-202",
        location: {
            continent: "Africa",
            country: "Ethiopia",
            region: "Addis Ababa",
            district: "Arada",
            specificLocation: "Arada Subcity, Near Arada Cinema",
            latitude: 9.1056,
            longitude: 38.8636,
        },
        transformers: ["TR-009"],
        technicians: ["user-002"],
        plantedDate: "2024-06-15T00:00:00Z",
        status: "nominal",
        healthScore: 96,
        maintenance: [],
        activeAlerts: 0,
        lastUpdated: new Date().toISOString(),
    },
    {
        id: "site-007",
        name: "Gulele Heights",
        code: "ADD-311",
        location: {
            continent: "Africa",
            country: "Ethiopia",
            region: "Addis Ababa",
            district: "Gulele",
            specificLocation: "Gulele Subcity, Near Entoto Mountain",
            latitude: 9.1256,
            longitude: 38.8836,
        },
        transformers: ["TR-010", "TR-011"],
        technicians: ["user-003", "user-004", "user-007"],
        plantedDate: "2023-11-20T00:00:00Z",
        status: "critical",
        healthScore: 42,
        maintenance: [maintenanceRecords[0], maintenanceRecords[4]],
        activeAlerts: 1,
        lastUpdated: new Date().toISOString(),
    },

    // ========== KENYA SITES ==========
    {
        id: "site-008",
        name: "Nairobi Central",
        code: "NBO-001",
        location: {
            continent: "Africa",
            country: "Kenya",
            region: "Nairobi",
            district: "Central",
            specificLocation: "Nairobi CBD, Kenyatta Avenue",
            latitude: -1.2921,
            longitude: 36.8219,
        },
        transformers: ["TR-012", "TR-013"],
        technicians: ["user-008"],
        plantedDate: "2024-02-10T00:00:00Z",
        status: "nominal",
        healthScore: 89,
        maintenance: [maintenanceRecords[5]],
        activeAlerts: 0,
        lastUpdated: new Date().toISOString(),
    },
    {
        id: "site-009",
        name: "Mombasa Road",
        code: "NBO-042",
        location: {
            continent: "Africa",
            country: "Kenya",
            region: "Nairobi",
            district: "Industrial Area",
            specificLocation: "Mombasa Road, Next to TPS",
            latitude: -1.3031,
            longitude: 36.8459,
        },
        transformers: ["TR-014"],
        technicians: ["user-008", "user-009"],
        plantedDate: "2024-05-15T00:00:00Z",
        status: "alarm",
        healthScore: 62,
        maintenance: [maintenanceRecords[6]],
        activeAlerts: 1,
        lastUpdated: new Date().toISOString(),
    },

    // ========== TANZANIA SITES ==========
    {
        id: "site-010",
        name: "Dar es Salaam Central",
        code: "DAR-001",
        location: {
            continent: "Africa",
            country: "Tanzania",
            region: "Dar es Salaam",
            district: "Ilala",
            specificLocation: "Samora Avenue, Near Post Office",
            latitude: -6.8225,
            longitude: 39.2712,
        },
        transformers: ["TR-015", "TR-016"],
        technicians: ["user-010"],
        plantedDate: "2024-03-01T00:00:00Z",
        status: "nominal",
        healthScore: 87,
        maintenance: [],
        activeAlerts: 0,
        lastUpdated: new Date().toISOString(),
    },
    {
        id: "site-011",
        name: "Arusha Substation",
        code: "ARU-003",
        location: {
            continent: "Africa",
            country: "Tanzania",
            region: "Arusha",
            district: "Arusha City",
            specificLocation: "Sokoine Road, Near Clock Tower",
            latitude: -3.3727,
            longitude: 36.6902,
        },
        transformers: ["TR-017"],
        technicians: ["user-010", "user-011"],
        plantedDate: "2024-07-20T00:00:00Z",
        status: "critical",
        healthScore: 38,
        maintenance: [maintenanceRecords[3], maintenanceRecords[6]],
        activeAlerts: 2,
        lastUpdated: new Date().toISOString(),
    },

    // ========== SOUTH AFRICA SITES ==========
    {
        id: "site-012",
        name: "Johannesburg CBD",
        code: "JHB-001",
        location: {
            continent: "Africa",
            country: "South Africa",
            region: "Gauteng",
            district: "Johannesburg",
            specificLocation: "Commissioner Street, CBD",
            latitude: -26.2041,
            longitude: 28.0473,
        },
        transformers: ["TR-018", "TR-019"],
        technicians: ["user-012"],
        plantedDate: "2024-04-10T00:00:00Z",
        status: "nominal",
        healthScore: 92,
        maintenance: [maintenanceRecords[0], maintenanceRecords[4]],
        activeAlerts: 0,
        lastUpdated: new Date().toISOString(),
    },
    {
        id: "site-013",
        name: "Cape Town Stadium",
        code: "CPT-002",
        location: {
            continent: "Africa",
            country: "South Africa",
            region: "Western Cape",
            district: "Cape Town",
            specificLocation: "Fritz Sonnenberg Road, Green Point",
            latitude: -33.9037,
            longitude: 18.4097,
        },
        transformers: ["TR-020"],
        technicians: ["user-012", "user-013"],
        plantedDate: "2024-09-01T00:00:00Z",
        status: "alarm",
        healthScore: 55,
        maintenance: [maintenanceRecords[2]],
        activeAlerts: 1,
        lastUpdated: new Date().toISOString(),
    },

    // ========== EGYPT SITES ==========
    {
        id: "site-014",
        name: "Cairo Downtown",
        code: "CAI-005",
        location: {
            continent: "Africa",
            country: "Egypt",
            region: "Cairo",
            district: "Downtown",
            specificLocation: "Tahrir Square, Downtown Cairo",
            latitude: 30.0444,
            longitude: 31.2357,
        },
        transformers: ["TR-021", "TR-022"],
        technicians: ["user-014"],
        plantedDate: "2024-06-15T00:00:00Z",
        status: "nominal",
        healthScore: 88,
        maintenance: [],
        activeAlerts: 0,
        lastUpdated: new Date().toISOString(),
    },

    // ========== NIGERIA SITES ==========
    {
        id: "site-015",
        name: "Lagos Island",
        code: "LOS-001",
        location: {
            continent: "Africa",
            country: "Nigeria",
            region: "Lagos",
            district: "Lagos Island",
            specificLocation: "Broad Street, Lagos Island",
            latitude: 6.4531,
            longitude: 3.3958,
        },
        transformers: ["TR-023"],
        technicians: ["user-015"],
        plantedDate: "2024-08-01T00:00:00Z",
        status: "critical",
        healthScore: 28,
        maintenance: [maintenanceRecords[3], maintenanceRecords[6]],
        activeAlerts: 3,
        lastUpdated: new Date().toISOString(),
    },
];

// ============================================================
// HELPER FUNCTIONS
// ============================================================

export const getSiteById = (id: string): Site | undefined => {
    return DEMO_SITES.find((site) => site.id === id);
};

export const getSitesByStatus = (status: Site["status"]): Site[] => {
    return DEMO_SITES.filter((site) => site.status === status);
};

export const getSitesByRegion = (region: string): Site[] => {
    return DEMO_SITES.filter((site) => site.location.region === region);
};

export const getSitesByDistrict = (district: string): Site[] => {
    return DEMO_SITES.filter((site) => site.location.district === district);
};

export const getSitesByCountry = (country: string): Site[] => {
    return DEMO_SITES.filter((site) => site.location.country === country);
};

export const getSitesByContinent = (continent: string): Site[] => {
    return DEMO_SITES.filter((site) => site.location.continent === continent);
};

export const getSiteMaintenance = (siteId: string): MaintenanceRecord[] => {
    const site = getSiteById(siteId);
    return site?.maintenance || [];
};

export const getUniqueContinents = (): string[] => {
    const continents = DEMO_SITES.map((site) => site.location.continent);
    return [...new Set(continents)];
};

export const getUniqueCountries = (): string[] => {
    const countries = DEMO_SITES.map((site) => site.location.country);
    return [...new Set(countries)];
};

export const getUniqueRegions = (): string[] => {
    const regions = DEMO_SITES.map((site) => site.location.region);
    return [...new Set(regions)];
};

export const getUniqueDistricts = (): string[] => {
    const districts = DEMO_SITES.map((site) => site.location.district);
    return [...new Set(districts)];
};

export const getCountriesByContinent = (continent: string): string[] => {
    const countries = DEMO_SITES
        .filter((site) => site.location.continent === continent)
        .map((site) => site.location.country);
    return [...new Set(countries)];
};

export const getRegionsByCountry = (country: string): string[] => {
    const regions = DEMO_SITES
        .filter((site) => site.location.country === country)
        .map((site) => site.location.region);
    return [...new Set(regions)];
};


// Add to existing file:

// ============================================================
// ACTIVITY LOGS
// ============================================================

export const DEMO_ACTIVITY_LOGS: Record<string, ActivityLogEntry[]> = {
    "site-001": [
        {
            id: "act-001",
            type: "maintenance",
            message: "Oil filter replacement completed",
            timestamp: "2026-05-10T09:00:00Z",
            userId: "user-003",
            userName: "Mike Field",
            metadata: { tasks: ["Oil filter replacement", "Cooling system inspection"] },
        },
        {
            id: "act-002",
            type: "technician_assigned",
            message: "Mike Field assigned to site",
            timestamp: "2026-01-15T08:00:00Z",
            userId: "user-001",
            userName: "John Admin",
            metadata: { technicianId: "user-003", technicianName: "Mike Field" },
        },
        {
            id: "act-003",
            type: "maintenance",
            message: "Routine inspection and load balancing check",
            timestamp: "2026-04-15T14:30:00Z",
            userId: "user-003",
            userName: "Mike Field",
            metadata: { tasks: ["Routine inspection", "Load balancing check"] },
        },
    ],
    "site-002": [
        {
            id: "act-004",
            type: "alert",
            message: "Critical: Oil temperature exceeded 87°C",
            timestamp: "2026-06-15T10:00:00Z",
            userId: "user-002",
            userName: "Sarah NOC",
            metadata: { alertId: "ALT-001", severity: "high" },
        },
        {
            id: "act-005",
            type: "maintenance",
            message: "Emergency response - cooling fan replaced",
            timestamp: "2026-06-01T11:00:00Z",
            userId: "user-004",
            userName: "Lisa Manager",
            metadata: { tasks: ["Emergency response", "Cooling fan replacement"] },
        },
    ],
    "site-003": [
        {
            id: "act-006",
            type: "status_change",
            message: "Site status changed from Alarm to Critical",
            timestamp: "2026-06-16T08:30:00Z",
            userId: "user-002",
            userName: "Sarah NOC",
            metadata: { previousStatus: "alarm", newStatus: "critical" },
        },
        {
            id: "act-007",
            type: "maintenance",
            message: "Emergency maintenance - gasket replacement",
            timestamp: "2026-05-20T09:30:00Z",
            userId: "user-003",
            userName: "Mike Field",
            metadata: { tasks: ["Gasket replacement", "Oil top-up"] },
        },
    ],
};

// ============================================================
// TECHNICIAN DATA
// ============================================================

export const DEMO_TECHNICIANS = [
    { id: "user-003", name: "Mike Field", email: "mike.field@safaricom.com", role: "field_engineer" },
    { id: "user-004", name: "Lisa Manager", email: "lisa.manager@safaricom.com", role: "manager" },
    { id: "user-002", name: "Sarah NOC", email: "sarah.noc@safaricom.com", role: "noc_operator" },
    { id: "user-005", name: "David Tech", email: "david.tech@safaricom.com", role: "field_engineer" },
    { id: "user-006", name: "Alice Junior", email: "alice.junior@safaricom.com", role: "field_engineer" },
    { id: "user-007", name: "Bob Senior", email: "bob.senior@safaricom.com", role: "field_engineer" },
    { id: "user-008", name: "Catherine NOC", email: "catherine.noc@safaricom.com", role: "noc_operator" },
];

export const getTechnicianById = (id: string) => {
    return DEMO_TECHNICIANS.find((t) => t.id === id);
};

export const getTechniciansByIds = (ids: string[]) => {
    return DEMO_TECHNICIANS.filter((t) => ids.includes(t.id));
};

export const getAvailableTechnicians = (assignedIds: string[]) => {
    return DEMO_TECHNICIANS.filter((t) => !assignedIds.includes(t.id));
};