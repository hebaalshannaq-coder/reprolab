import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Row, Col, Card, Form, Button, Spinner } from "react-bootstrap";
import { request } from "../api/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import Badge from "../components/Badge";
import Comments from "../components/Comments";
import Timeline from "../components/Timeline";
import { STATUSES } from "../utils/constants";

const BugDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const { notify } = useToast();
    const navigate = useNavigate();

    const [bug, setBug] = useState(null);
    const [comments, setComments] = useState([]);
    const [activity, setActivity] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState("");

    const loadAll = useCallback(async () => {
        try {
            setLoadError("");
            const [bugData, commentsData, activityData] = await Promise.all([
                request(`/bugs/${id}`),
                request(`/bugs/${id}/comments`),
                request(`/bugs/${id}/activity`),
            ]);
            setBug(bugData);
            setComments(commentsData);
            setActivity(activityData);
        } catch (err) {
            setLoadError(err.message);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        loadAll();
    }, [loadAll]);

    const handleStatusChange = async (e) => {
        try {
            await request(`/bugs/${id}`, {
                method: "PUT",
                body: { status: e.target.value },
            });
            notify("Status updated");
            await loadAll();
        } catch (err) {
            notify(err.message, "error");
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Delete this bug with its comments and history?")) return;

        try {
            await request(`/bugs/${id}`, { method: "DELETE" });
            notify("Bug deleted");
            navigate(`/projects/${bug.project._id}`);
        } catch (err) {
            notify(err.message, "error");
        }
    };

    if (loading) {
        return (
            <div className="text-center my-5">
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }

    if (loadError) {
        return (
            <div className="text-center my-5">
                <p className="text-muted">{loadError}</p>
                <Link to="/">← Back to projects</Link>
            </div>
        );
    }

    const canModify = user.role === "admin" || bug.reporter?._id === user._id;

    return (
        <div>
            <Link to={`/projects/${bug.project._id}`} className="text-muted">
                ← Back to {bug.project.name}
            </Link>

            <div className="mt-3 mb-4">
                <h2 className="page-title mb-3">{bug.title}</h2>
                <div className="mb-2 d-flex flex-wrap gap-1">
                    <Badge label={bug.status} />
                    <Badge label={bug.severity} />
                    <Badge label={bug.priority} />
                </div>
                <small className="text-muted">
                    Reported by {bug.reporter?.name || "Deleted user"} on{" "}
                    {new Date(bug.createdAt).toLocaleString()}
                    {bug.assignee && ` · Assigned to ${bug.assignee.name}`}
                </small>
            </div>

            {canModify && (
                <Card className="p-3 mb-4">
                    <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                        <div className="d-flex align-items-center gap-2">
                            <Form.Label className="mb-0">Status</Form.Label>
                            <Form.Select
                                size="sm"
                                style={{ width: "auto" }}
                                value={bug.status}
                                onChange={handleStatusChange}
                            >
                                {STATUSES.map((s) => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </Form.Select>
                        </div>
                        <Button variant="outline-danger" size="sm" onClick={handleDelete}>
                            Delete bug
                        </Button>
                    </div>
                </Card>
            )}

            <Row className="g-4">
                <Col lg={8}>
                    <Card className="p-3 mb-4">
                        {bug.description && (
                            <>
                                <h6 className="text-muted">Description</h6>
                                <p>{bug.description}</p>
                            </>
                        )}

                        <h6 className="text-muted">Steps to reproduce</h6>
                        <p style={{ whiteSpace: "pre-wrap" }}>{bug.stepsToReproduce}</p>

                        <Row>
                            <Col md={6}>
                                <h6 className="text-muted">Expected result</h6>
                                <p>{bug.expectedResult}</p>
                            </Col>
                            <Col md={6}>
                                <h6 className="text-muted">Actual result</h6>
                                <p>{bug.actualResult}</p>
                            </Col>
                        </Row>

                        {bug.environment && (
                            <>
                                <h6 className="text-muted">Environment</h6>
                                <p className="mb-0">{bug.environment}</p>
                            </>
                        )}
                    </Card>

                    <h5 className="mb-3">Comments ({comments.length})</h5>
                    <Comments bugId={id} comments={comments} onChanged={loadAll} />
                </Col>

                <Col lg={4}>
                    <Card className="p-3">
                        <h5 className="mb-3">Timeline</h5>
                        <Timeline activity={activity} />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default BugDetails;