import { ComingSoon } from "@/components/common/coming-soon";

export default function LiveMonitoringPage() {
    return (
        <ComingSoon
            title="Live Monitoring"
            description="Real-time monitoring and visualization of all your transformer sites"
            estimatedDate="Q4 2025"
            features={[
                "Real-time sensor data streaming",
                "Interactive site dashboard",
                "Live status updates every 30 seconds",
                "Multi-site comparison view",
                "Custom alert thresholds",
                "Historical data playback",
            ]}
            showBackButton={false}
            showHomeButton={true}
        />
    );
}