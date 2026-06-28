import { ThresholdConfig } from "@/types/transformer.type";

// ============================================================
// STATUS COLORS
// ============================================================

export const STATUS_COLORS = {
    nominal: {
        bg: "bg-emerald-50 dark:bg-emerald-950",
        text: "text-emerald-700 dark:text-emerald-400",
        border: "border-emerald-200 dark:border-emerald-800",
        dot: "bg-emerald-500",
        hex: "#22C55E",
    },
    alarm: {
        bg: "bg-amber-50 dark:bg-amber-950",
        text: "text-amber-700 dark:text-amber-400",
        border: "border-amber-200 dark:border-amber-800",
        dot: "bg-amber-500",
        hex: "#F59E0B",
    },
    critical: {
        bg: "bg-red-50 dark:bg-red-950",
        text: "text-red-700 dark:text-red-400",
        border: "border-red-200 dark:border-red-800",
        dot: "bg-red-500",
        hex: "#EF4444",
    },
};

export const SEVERITY_COLORS = {
    info: {
        bg: "bg-blue-50 dark:bg-blue-950",
        text: "text-blue-700 dark:text-blue-400",
        border: "border-blue-200 dark:border-blue-800",
        dot: "bg-blue-500",
    },
    warning: {
        bg: "bg-amber-50 dark:bg-amber-950",
        text: "text-amber-700 dark:text-amber-400",
        border: "border-amber-200 dark:border-amber-800",
        dot: "bg-amber-500",
    },
    high: {
        bg: "bg-orange-50 dark:bg-orange-950",
        text: "text-orange-700 dark:text-orange-400",
        border: "border-orange-200 dark:border-orange-800",
        dot: "bg-orange-500",
    },
    critical: {
        bg: "bg-red-50 dark:bg-red-950",
        text: "text-red-700 dark:text-red-400",
        border: "border-red-200 dark:border-red-800",
        dot: "bg-red-500",
    },
};

// ============================================================
// ANTI-THEFT STATUS COLORS
// ============================================================

export const ANTITHEFT_COLORS = {
    secure: {
        bg: "bg-emerald-50 dark:bg-emerald-950",
        text: "text-emerald-700 dark:text-emerald-400",
        border: "border-emerald-200 dark:border-emerald-800",
        dot: "bg-emerald-500",
        icon: "🔒",
        label: "Secure",
    },
    tamper_warning: {
        bg: "bg-amber-50 dark:bg-amber-950",
        text: "text-amber-700 dark:text-amber-400",
        border: "border-amber-200 dark:border-amber-800",
        dot: "bg-amber-500",
        icon: "⚠️",
        label: "Tamper Warning",
    },
    intrusion: {
        bg: "bg-red-50 dark:bg-red-950",
        text: "text-red-700 dark:text-red-400",
        border: "border-red-200 dark:border-red-800",
        dot: "bg-red-500",
        icon: "🚨",
        label: "Intrusion",
    },
};

// ============================================================
// TRANSFORMER TYPE LABELS
// ============================================================

export const TRANSFORMER_TYPE_LABELS = {
    "25KVA": "25 KVA",
    "50KVA": "50 KVA",
};

// ============================================================
// ALERT TYPE LABELS
// ============================================================

export const ALERT_TYPE_LABELS: Record<string, string> = {
    temperature: "Temperature",
    current: "Load Current",
    voltage: "Voltage",
    oil: "Oil Level",
    gas: "Dissolved Gas",
    vibration: "Vibration",
    anti_theft: "Anti-Theft",
    cable_cut: "Cable Cut",
    gps: "GPS Displacement",
    enclosure: "Enclosure Tamper",
};

export const ALERT_TYPE_ICONS: Record<string, string> = {
    temperature: "🌡️",
    current: "⚡",
    voltage: "🔌",
    oil: "🛢️",
    gas: "💨",
    vibration: "📳",
    anti_theft: "🔒",
    cable_cut: "✂️",
    gps: "📍",
    enclosure: "🚪",
};

// ============================================================
// THRESHOLD REFERENCE
// ============================================================

export const THRESHOLD_REFERENCE = {
    temperature: {
        label: "Winding/Oil Temperature",
        unit: "°C",
        nominal: "< 80",
        alarm: "80 – 95",
        critical: "> 95",
    },
    current: {
        label: "Load Current",
        unit: "% rated",
        nominal: "≤ 80",
        alarm: "81 – 110",
        critical: "> 110",
    },
    voltage: {
        label: "Voltage Levels",
        unit: "±%",
        nominal: "±5",
        alarm: "±5 – 10",
        critical: "> ±10",
    },
    oilLevel: {
        label: "Oil Level",
        unit: "%",
        nominal: "90 – 100",
        alarm: "70 – 89",
        critical: "< 70",
    },
    gas: {
        label: "Dissolved Gas",
        unit: "ppm",
        nominal: "Within IEC ratios",
        alarm: "Trending abnormal",
        critical: "Exceeds IEC critical ratios",
    },
    vibration: {
        label: "Vibration",
        unit: "mm/s",
        nominal: "< 2.0",
        alarm: "2.0 – 5.0",
        critical: "> 5.0",
    },
};

// ============================================================
// REGION LIST
// ============================================================

export const REGIONS = [
    "Addis Ababa",
    "Oromia",
    "Amhara",
    "Tigray",
    "Sidama",
    "Southern Nations",
    "Somali",
    "Benishangul-Gumuz",
    "Gambela",
    "Harari",
    "Afar",
];

// ============================================================
// DISTRICTS BY REGION
// ============================================================

export const DISTRICTS_BY_REGION: Record<string, string[]> = {
    "Addis Ababa": ["Bole", "Kirkos", "Lideta", "Mexico", "Arada", "Gulele", "Yeka", "Nifas Silk"],
    Oromia: ["Adama", "Bishoftu", "Jimma", "Nekemte", "Shashamane", "Ambo"],
    Amhara: ["Bahir Dar", "Gondar", "Dessie", "Debre Markos", "Debre Berhan"],
    Tigray: ["Mekelle", "Adwa", "Axum", "Shire"],
    // ... etc
};