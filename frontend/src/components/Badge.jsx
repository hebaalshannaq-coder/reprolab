const COLORS = {
    Critical: "#f43f5e",
    Major: "#fb923c",
    Minor: "#facc15",
    High: "#f43f5e",
    Medium: "#fb923c",
    Low: "#64748b",
    New: "#38bdf8",
    "In Progress": "#a78bfa",
    Fixed: "#34d399",
    Verified: "#2dd4bf",
    Closed: "#64748b",
};

const DARK_TEXT = ["Minor", "Fixed", "Verified", "New"];

const Badge = ({ label }) => {
    return (
        <span
            style={{
                background: COLORS[label] || "#64748b",
                color: DARK_TEXT.includes(label) ? "#0b1a1f" : "#ffffff",
                padding: "3px 10px",
                borderRadius: "999px",
                fontSize: "12px",
                fontWeight: 600,
                marginRight: "6px",
                display: "inline-block",
            }}
        >
            {label}
        </span>
    );
};

export default Badge;