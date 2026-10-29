import { useEffect, useState } from "react";
import { request } from "../api/api";
import Badge from "./Badge";

const StatsOverview = ({ refreshKey }) => {
    const [stats, setStats] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadStats = async () => {
            try {
                setError("");
                const data = await request("/admin/stats");
                setStats(data);
            } catch (err) {
                setError(err.message);
            }
        };
        loadStats();
    }, [refreshKey]);

    if (error) return <p style={{ color: "red" }}>{error}</p>;
    if (!stats) return <p>Loading statistics...</p>;

    return (
        <div>
            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                <div style={cardStyle}>
                    <h3>{stats.totalUsers}</h3>
                    <p>Users</p>
                </div>
                <div style={cardStyle}>
                    <h3>{stats.totalProjects}</h3>
                    <p>Projects</p>
                </div>
                <div style={cardStyle}>
                    <h3>{stats.totalBugs}</h3>
                    <p>Bugs</p>
                </div>
            </div>

            <h4>Bugs by status</h4>
            <ul>
                {Object.entries(stats.bugsByStatus).map(([label, count]) => (
                    <li key={label}>
                        <Badge label={label} /> {count}
                    </li>
                ))}
            </ul>

            <h4>Bugs by severity</h4>
            <ul>
                {Object.entries(stats.bugsBySeverity).map(([label, count]) => (
                    <li key={label}>
                        <Badge label={label} /> {count}
                    </li>
                ))}
            </ul>
        </div>
    );
};

const cardStyle = {
    border: "1px solid #ccc",
    borderRadius: "8px",
    padding: "8px 24px",
    textAlign: "center",
};

export default StatsOverview;