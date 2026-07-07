import { ComingSoon } from "@/components/common/coming-soon";

export default function SettingsPage() {
    return (
        <ComingSoon
            title="Settings"
            description="Configure and customize your SmartTrans dashboard"
            estimatedDate="Q4 2025"
            features={[
                "User profile management",
                "Notification preferences",
                "Alert thresholds configuration",
                "Site and transformer management",
                "User role and permission settings",
                "API integration settings",
            ]}
            showBackButton={false}
            showHomeButton={true}
        />
    );
}