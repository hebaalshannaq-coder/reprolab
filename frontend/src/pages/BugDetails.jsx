import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { request } from "../api/api";
import { useAuth } from "../context/AuthContext";
import Badge from "../components/Badge";
import Comments from "../components/Comments";
import Timeline from "../components/Timeline";
import { STATUSES } from "../utils/constants";

const BugDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [bug, setBug] = useState(null);
    const [comments, setComments] = useState([]);
    const [activity, setActivity] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [actionError, setActionError] = useState("");

    const loadAll = useCallback(async () => {
        try {
            setError("");
            const [bugData, commentsData, activityData] = await Promise.all([
                request(`/bugs/${id}`),
                request(`/bugs/${id}/comments`),
                request(`/bugs/${id}/activity`),
            ]);
            setBug(bugData);
            setComments(commentsData);
            setActivity(activityData);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        loadAll();
    }, [loadAll]);

    const handleStatusChange = async (e) => {
        setActionError("");
        try {
            await request(`/bugs/${id}`, {
                method: "PUT",
                body: { status: e.target.value },
            });
            await loadAll();
        } catch (err) {
            setActionError(err.message);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Delete this bug with its comments and history?")) return;

        try {
            await request(`/bugs/${id}`, { method: "DELETE" });
            navigate(`/projects/${bug.project._id}`);
        } catch (err) {
            setActionError(err.message);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) {
        return (
            <div>
                <p style={{ color: "red" }}>{error}</p>
                <Link to="/">← Back to projects</Link>
            </div>
        );
    }

    const canModify =
        user.role === "admin" || bug.reporter?._id === user._id;

    return (
        <div>
            <Link to={`/projects/${bug.project._id}`}>
                ← Back to {bug.project.name}
            </Link>

            <h2>{bug.title}</h2>
            <div>
                <Badge label={bug.status} />
                <Badge label={bug.severity} />
                <Badge label={bug.priority} />
            </div>

            <p>
                <small>
                    Reported by {bug.reporter?.name || "Deleted user"} on{" "}
                    {new Date(bug.createdAt).toLocaleString()}
                    {bug.assignee && ` · Assigned to ${bug.assignee.name}`}
                </small>
            </p>

            {actionError && <p style={{ color: "red" }}>{actionError}</p>}

            {canModify && (
                <div>
                    <label>
                        Status:{" "}
                        <select value={bug.status} onChange={handleStatusChange}>
                            {STATUSES.map((s) => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </label>
                    <button onClick={handleDelete}>Delete bug</button>
                </div>
            )}

            {bug.description && (
                <>
                    <h3>Description</h3>
                    <p>{bug.description}</p>
                </>
            )}

            <h3>Steps to reproduce</h3>
            <p style={{ whiteSpace: "pre-wrap" }}>{bug.stepsToReproduce}</p>

            <h3>Expected result</h3>
            <p>{bug.expectedResult}</p>

            <h3>Actual result</h3>
            <p>{bug.actualResult}</p>

            {bug.environment && (
                <>
                    <h3>Environment</h3>
                    <p>{bug.environment}</p>
                </>
            )}

            <hr />
            <h3>Timeline</h3>
            <Timeline activity={activity} />

            <hr />
            <h3>Comments ({comments.length})</h3>
            <Comments bugId={id} comments={comments} onChanged={loadAll} />
        </div>
    );
};

export default BugDetails;