const describe = (item) => {
    if (item.action === "created") {
        return "created this bug";
    }
    if (item.action === "status_changed") {
        return `changed the status from "${item.from}" to "${item.to}"`;
    }
    if (item.action === "assigned") {
        return "changed the assignee";
    }
    return item.action;
};

const Timeline = ({ activity }) => {
    if (activity.length === 0) {
        return <p>No activity yet.</p>;
    }

    return (
        <ul>
            {activity.map((item) => (
                <li key={item._id}>
                    <strong>{item.user?.name || "Deleted user"}</strong> {describe(item)}
                    <br />
                    <small>{new Date(item.createdAt).toLocaleString()}</small>
                </li>
            ))}
        </ul>
    );
};

export default Timeline;