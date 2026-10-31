import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col, Card, Spinner } from "react-bootstrap";
import { request } from "../api/api";
import { useToast } from "../context/ToastContext";
import Badge from "./Badge";

const COLORS = {
    New: "#38bdf8",
    "In Progress": "#a78bfa",
    Fixed: "#34d399",
    Verified: "#2dd4bf",
    Closed: "#64748b",
    Critical: "#f43f5e",
    Major: "#fb923c",
    Minor: "#facc15",
};

const StatCard = ({ icon, value, label, color, onClick }) => (
    <Card className="stat-card h-100 clickable-card" role="button" onClick={onClick}>
        <div className="d-flex align-items-center gap-3 p-3">
            <div className="stat-icon" style={{ background: `${color}22`, color }}>
                {icon}
            </div>
            <div>
                <div className="stat-value">{value}</div>
                <div className="text-muted small">{label}</div>
            </div>
        </div>
    </Card>
);

const BreakdownCard = ({ title, data, param }) => {
    const navigate = useNavigate();
    const total = Object.values(data).reduce((sum, n) => sum + n, 0);

    return (
        <Card className="p-3 h-100">
            <h6 className="mb-3">{title}</h6>
            {Object.entries(data).map(([label, count]) => {
                const percent = total ? Math.round((count / total) * 100) : 0;
                return (
                    <div
                        key={label}
                        className="stat-row"
                        role="button"
                        onClick={() =>
                            navigate(`/admin/bugs?${param}=${encodeURIComponent(label)}`)
                        }
                    >
                        <div className="d-flex justify-content-between align-items-center mb-1">
                            <Badge label={label} />
                            <small className="text-muted">
                                <strong>{count}</strong> · {percent}% →
                            </small>
                        </div>
                        <div className="progress-track">
                            <div
                                className="progress-fill"
                                style={{
                                    width: `${percent}%`,
                                    background: COLORS[label] || "var(--primary)",
                                }}
                            />
                        </div>
                    </div>
                );
            })}
        </Card>
    );
};

const StatsOverview = ({ refreshKey }) => {
    const { notify } = useToast();
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);

    useEffect(() => {
        const loadStats = async () => {
            try {
                const data = await request("/admin/stats");
                setStats(data);
            } catch (err) {
                notify(err.message, "error");
            }
        };
        loadStats();
    }, [refreshKey, notify]);

    if (!stats) {
        return (
            <div className="text-center my-4">
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }

    return (
        <div>
            <Row className="g-3 mb-3">
                <Col xs={12} sm={4}>
                    <StatCard
                        icon="👥"
                        value={stats.totalUsers}
                        label="Users"
                        color="#2dd4bf"
                        onClick={() =>
                            document
                                .getElementById("users-section")
                                ?.scrollIntoView({ behavior: "smooth" })
                        }
                    />
                </Col>
                <Col xs={12} sm={4}>
                    <StatCard
                        icon="📁"
                        value={stats.totalProjects}
                        label="Projects"
                        color="#ff6b8b"
                        onClick={() => navigate("/")}
                    />
                </Col>
                <Col xs={12} sm={4}>
                    <StatCard
                        icon="🐞"
                        value={stats.totalBugs}
                        label="Bugs"
                        color="#a78bfa"
                        onClick={() => navigate("/admin/bugs")}
                    />
                </Col>
            </Row>
            <Row className="g-3">
                <Col md={6}>
                    <BreakdownCard title="Bugs by status" data={stats.bugsByStatus} param="status" />
                </Col>
                <Col md={6}>
                    <BreakdownCard title="Bugs by severity" data={stats.bugsBySeverity} param="severity" />
                </Col>
            </Row>
        </div>
    );
};

export default StatsOverview;