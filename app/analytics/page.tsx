import { ComingSoon } from "@/components/common/coming-soon";


export default function AnalyticsPage() {
    return (
        <ComingSoon
            title="Analytics Dashboard"
            description="Advanced analytics and insights for your transformer fleet"
            estimatedDate="Q4 2025"
            features={[
                "Predictive maintenance insights",
                "Failure trend analysis",
                "Fleet health comparison",
                "Custom report generation",
                "Export to PDF/CSV",
                "Anomaly pattern detection",
            ]}
        />
    );
}