import { ComingSoon } from "@/components/common/coming-soon";

export default function AlertsPage() {
    return (
        <ComingSoon
            title="Alerts Center"
            description="Centralized alert management for your entire transformer network"
            estimatedDate="Q4 2025"
            features={[
                "Real-time alert notifications",
                "Severity-based filtering (Critical, High, Warning, Info)",
                "Alert acknowledgment and resolution tracking",
                "Automated technician assignment",
                "Alert escalation workflows",
                "Detailed alert history and audit trail",
            ]}
            showBackButton={false}
            showHomeButton={true}
        />
    );
}