const describe = (item) => {
    if (item.action === "created") return "created this bug";
    if (item.action === "status_changed") {
        return `changed the status from "${item.from}" to "${item.to}"`;
    }
    if (item.action === "assigned") return "changed the assignee";
    return item.action;
};

const Timeline = ({ activity }) => {
    if (activity.length === 0) {
        return <p className="text-muted">No activity yet.</p>;
    }

    return (
        <div style={{ borderLeft: "2px solid var(--border)", paddingLeft: "20px" }}>
            {activity.map((item) => (
                <div key={item._id} className="mb-3 position-relative">
                    <span
                        style={{
                            position: "absolute",
                            left: "-27px",
                            top: "6px",
                            width: "12px",
                            height: "12px",
                            borderRadius: "50%",
                            background: "var(--accent)",
                            border: "2px solid var(--bg)",
                        }}
                    />
                    <div>
                        <strong>{item.user?.name || "Deleted user"}</strong>{" "}
                        <span className="text-muted">{describe(item)}</span>
                    </div>
                    <small className="text-muted">
                        {new Date(item.createdAt).toLocaleString()}
                    </small>
                </div>
            ))}
        </div>
    );
};

export default Timeline;