import {
  User,
  UserRole,
  UserStatus,
  UserLocation,
  UserStats,
} from "@/types/user.type";

// ============================================================
// DEMO USERS
// ============================================================

const locations: UserLocation[] = [
  {
    continent: "Africa",
    country: "Ethiopia",
    region: "Addis Ababa",
    district: "Bole",
  },
  {
    continent: "Africa",
    country: "Ethiopia",
    region: "Addis Ababa",
    district: "Kirkos",
  },
  {
    continent: "Africa",
    country: "Ethiopia",
    region: "Addis Ababa",
    district: "Lideta",
  },
  {
    continent: "Africa",
    country: "Ethiopia",
    region: "Addis Ababa",
    district: "Mexico",
  },
  {
    continent: "Africa",
    country: "Ethiopia",
    region: "Oromia",
    district: "Adama",
  },
  {
    continent: "Africa",
    country: "Ethiopia",
    region: "Amhara",
    district: "Bahir Dar",
  },
  {
    continent: "Africa",
    country: "Ethiopia",
    region: "Tigray",
    district: "Mekelle",
  },
  {
    continent: "Africa",
    country: "Kenya",
    region: "Nairobi",
    district: "Central",
  },
  {
    continent: "Africa",
    country: "Kenya",
    region: "Nairobi",
    district: "Industrial Area",
  },
  {
    continent: "Africa",
    country: "Tanzania",
    region: "Dar es Salaam",
    district: "Ilala",
  },
  {
    continent: "Africa",
    country: "South Africa",
    region: "Gauteng",
    district: "Johannesburg",
  },
  {
    continent: "Africa",
    country: "Egypt",
    region: "Cairo",
    district: "Downtown",
  },
  {
    continent: "Africa",
    country: "Nigeria",
    region: "Lagos",
    district: "Lagos Island",
  },
];

export const DEMO_USERS: User[] = [
  // ========== ADMINS ==========
  {
    id: "user-001",
    email: "admin@safaricom.com",
    name: "John Admin",
    role: "admin",
    status: "active",
    location: locations[0],
    phone: "+251-911-123-456",
    assignedSites: ["site-001", "site-002", "site-003", "site-004", "site-005"],
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2026-07-01T00:00:00Z",
    lastActive: "2026-07-07T10:00:00Z",
  },

  // ========== COUNTRY MANAGERS ==========
  {
    id: "user-002",
    email: "sarah.noc@safaricom.com",
    name: "Sarah NOC",
    role: "country_manager",
    status: "active",
    location: locations[0],
    phone: "+251-911-234-567",
    assignedSites: [
      "site-001",
      "site-002",
      "site-003",
      "site-004",
      "site-005",
      "site-006",
      "site-007",
    ],
    createdAt: "2023-01-15T00:00:00Z",
    updatedAt: "2026-07-01T00:00:00Z",
    lastActive: "2026-07-07T09:30:00Z",
    createdBy: "user-001",
  },
  {
    id: "user-016",
    email: "peter.country@vodafone.com",
    name: "Peter Country",
    role: "country_manager",
    status: "active",
    location: locations[7],
    phone: "+254-711-234-567",
    assignedSites: ["site-008", "site-009"],
    createdAt: "2024-03-01T00:00:00Z",
    updatedAt: "2026-07-01T00:00:00Z",
    lastActive: "2026-07-06T16:00:00Z",
    createdBy: "user-001",
  },
  {
    id: "user-017",
    email: "grace.country@vodafone.com",
    name: "Grace Country",
    role: "country_manager",
    status: "active",
    location: locations[9],
    phone: "+255-711-234-567",
    assignedSites: ["site-010", "site-011"],
    createdAt: "2024-03-15T00:00:00Z",
    updatedAt: "2026-07-01T00:00:00Z",
    lastActive: "2026-07-06T15:00:00Z",
    createdBy: "user-001",
  },

  // ========== REGIONAL MANAGERS ==========
  {
    id: "user-004",
    email: "lisa.manager@safaricom.com",
    name: "Lisa Manager",
    role: "regional_manager",
    status: "active",
    location: locations[0],
    phone: "+251-911-345-678",
    assignedSites: ["site-001", "site-002", "site-003", "site-004"],
    createdAt: "2023-03-01T00:00:00Z",
    updatedAt: "2026-07-01T00:00:00Z",
    lastActive: "2026-07-06T14:30:00Z",
    createdBy: "user-002",
  },
  {
    id: "user-007",
    email: "bob.senior@safaricom.com",
    name: "Bob Senior",
    role: "regional_manager",
    status: "active",
    location: locations[3],
    phone: "+251-911-678-901",
    assignedSites: ["site-005", "site-006", "site-007"],
    createdAt: "2023-04-15T00:00:00Z",
    updatedAt: "2026-07-01T00:00:00Z",
    lastActive: "2026-07-06T13:00:00Z",
    createdBy: "user-002",
  },
  {
    id: "user-012",
    email: "ivy.senior@safaricom.com",
    name: "Ivy Senior",
    role: "regional_manager",
    status: "suspended",
    location: locations[7],
    phone: "+254-711-345-678",
    assignedSites: ["site-008"],
    createdAt: "2024-04-10T00:00:00Z",
    updatedAt: "2026-07-01T00:00:00Z",
    lastActive: "2026-06-20T10:00:00Z",
    createdBy: "user-016",
    suspendedAt: "2026-06-25T00:00:00Z",
    suspendedReason: "Policy violation - unauthorized access",
  },

  // ========== FIELD ENGINEERS ==========
  {
    id: "user-003",
    email: "mike.field@safaricom.com",
    name: "Mike Field",
    role: "field_engineer",
    status: "active",
    location: locations[0],
    phone: "+251-911-456-789",
    assignedSites: ["site-001", "site-002", "site-003", "site-005", "site-007"],
    createdAt: "2023-02-01T00:00:00Z",
    updatedAt: "2026-07-01T00:00:00Z",
    lastActive: "2026-07-07T08:45:00Z",
    createdBy: "user-004",
  },
  {
    id: "user-005",
    email: "david.tech@safaricom.com",
    name: "David Tech",
    role: "field_engineer",
    status: "active",
    location: locations[2],
    phone: "+251-911-567-890",
    assignedSites: ["site-004", "site-005"],
    createdAt: "2023-05-01T00:00:00Z",
    updatedAt: "2026-07-01T00:00:00Z",
    lastActive: "2026-07-06T17:00:00Z",
    createdBy: "user-004",
  },
  {
    id: "user-006",
    email: "alice.junior@safaricom.com",
    name: "Alice Junior",
    role: "field_engineer",
    status: "active",
    location: locations[3],
    phone: "+251-911-678-012",
    assignedSites: ["site-005", "site-006"],
    createdAt: "2023-06-15T00:00:00Z",
    updatedAt: "2026-07-01T00:00:00Z",
    lastActive: "2026-07-06T12:00:00Z",
    createdBy: "user-007",
  },
  {
    id: "user-008",
    email: "catherine.noc@safaricom.com",
    name: "Catherine NOC",
    role: "field_engineer",
    status: "active",
    location: locations[7],
    phone: "+254-711-456-789",
    assignedSites: ["site-008", "site-009"],
    createdAt: "2024-05-15T00:00:00Z",
    updatedAt: "2026-07-01T00:00:00Z",
    lastActive: "2026-07-06T11:00:00Z",
    createdBy: "user-016",
  },
  {
    id: "user-009",
    email: "david.engineer@safaricom.com",
    name: "David Engineer",
    role: "field_engineer",
    status: "inactive",
    location: locations[8],
    phone: "+254-711-567-890",
    assignedSites: ["site-009"],
    createdAt: "2024-06-01T00:00:00Z",
    updatedAt: "2026-07-01T00:00:00Z",
    lastActive: "2026-06-10T09:00:00Z",
    createdBy: "user-016",
  },

  // ========== TECHNICIANS ==========
  {
    id: "user-010",
    email: "grace.tech@safaricom.com",
    name: "Grace Tech",
    role: "technician",
    status: "active",
    location: locations[9],
    phone: "+255-711-456-789",
    assignedSites: ["site-010", "site-011"],
    createdAt: "2024-07-20T00:00:00Z",
    updatedAt: "2026-07-01T00:00:00Z",
    lastActive: "2026-07-06T10:00:00Z",
    createdBy: "user-017",
  },
  {
    id: "user-011",
    email: "henry.lead@safaricom.com",
    name: "Henry Lead",
    role: "technician",
    status: "active",
    location: locations[10],
    phone: "+255-711-567-890",
    assignedSites: ["site-011"],
    createdAt: "2024-08-01T00:00:00Z",
    updatedAt: "2026-07-01T00:00:00Z",
    lastActive: "2026-07-05T14:00:00Z",
    createdBy: "user-017",
  },
  {
    id: "user-013",
    email: "jack.field@safaricom.com",
    name: "Jack Field",
    role: "technician",
    status: "suspended",
    location: locations[11],
    phone: "+20-711-456-789",
    assignedSites: ["site-014"],
    createdAt: "2024-09-15T00:00:00Z",
    updatedAt: "2026-07-01T00:00:00Z",
    lastActive: "2026-06-15T08:00:00Z",
    createdBy: "user-001",
    suspendedAt: "2026-06-18T00:00:00Z",
    suspendedReason: "Repeated missed assignments",
  },
  {
    id: "user-014",
    email: "karen.support@safaricom.com",
    name: "Karen Support",
    role: "technician",
    status: "active",
    location: locations[12],
    phone: "+234-711-456-789",
    assignedSites: ["site-015"],
    createdAt: "2024-10-01T00:00:00Z",
    updatedAt: "2026-07-01T00:00:00Z",
    lastActive: "2026-07-06T09:00:00Z",
    createdBy: "user-001",
  },

  // ========== VIEWERS ==========
  {
    id: "user-015",
    email: "leo.manager@safaricom.com",
    name: "Leo Manager",
    role: "viewer",
    status: "active",
    location: locations[4],
    phone: "+251-911-789-012",
    assignedSites: ["site-001", "site-002"],
    createdAt: "2024-11-01T00:00:00Z",
    updatedAt: "2026-07-01T00:00:00Z",
    lastActive: "2026-07-06T08:00:00Z",
    createdBy: "user-002",
  },
];

// ============================================================
// HELPER FUNCTIONS
// ============================================================

export const getUserById = (id: string): User | undefined => {
  return DEMO_USERS.find((user) => user.id === id);
};

export const getUsersByRole = (role: UserRole): User[] => {
  return DEMO_USERS.filter((user) => user.role === role);
};

export const getUsersByStatus = (status: UserStatus): User[] => {
  return DEMO_USERS.filter((user) => user.status === status);
};

export const getUsersByCountry = (country: string): User[] => {
  return DEMO_USERS.filter((user) => user.location.country === country);
};

export const getUsersByRegion = (region: string): User[] => {
  return DEMO_USERS.filter((user) => user.location.region === region);
};

export const getUsersBySite = (siteId: string): User[] => {
  return DEMO_USERS.filter((user) => user.assignedSites.includes(siteId));
};

export const getUserStats = (): UserStats => {
  const total = DEMO_USERS.length;
  const active = DEMO_USERS.filter((u) => u.status === "active").length;
  const suspended = DEMO_USERS.filter((u) => u.status === "suspended").length;
  const inactive = DEMO_USERS.filter((u) => u.status === "inactive").length;

  const byRole: Record<UserRole, number> = {
    admin: 0,
    country_manager: 0,
    regional_manager: 0,
    field_engineer: 0,
    technician: 0,
    viewer: 0,
  };

  const byStatus: Record<UserStatus, number> = {
    active: 0,
    suspended: 0,
    inactive: 0,
  };

  DEMO_USERS.forEach((user) => {
    byRole[user.role] = (byRole[user.role] || 0) + 1;
    byStatus[user.status] = (byStatus[user.status] || 0) + 1;
  });

  return {
    total,
    active,
    suspended,
    inactive,
    byRole,
    byStatus,
  };
};

export const getUniqueCountries = (): string[] => {
  const countries = DEMO_USERS.map((user) => user.location.country);
  return [...new Set(countries)];
};

export const getUniqueRegions = (): string[] => {
  const regions = DEMO_USERS.map((user) => user.location.region);
  return [...new Set(regions)];
};

export const getUniqueDistricts = (): string[] => {
  const districts = DEMO_USERS.map((user) => user.location.district);
  return [...new Set(districts)];
};
