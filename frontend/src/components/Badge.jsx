const COLORS = {
    Critical: "#dc3545",
    Major: "#fd7e14",
    Minor: "#ffc107",
    High: "#dc3545",
    Medium: "#fd7e14",
    Low: "#6c757d",
    New: "#0d6efd",
    "In Progress": "#6f42c1",
    Fixed: "#198755",
    Verified: "#20c990",
    Closed: "#6c757d",
};

const Badge = ({ label }) => {
    return (
        <span
            style={{
                background: COLORS[label] || "#6c757d",
                color: "white",
                padding: "2px 8px",
                borderRadius: "10px",
                fontSize: "12px",
                marginRight: "6px",
            }}
        >
            {label}
        </span>
    );
};

export default Badge;