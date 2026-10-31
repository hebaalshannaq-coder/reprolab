import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Row, Col, Card, Form, Button, Spinner } from "react-bootstrap";
import { request } from "../api/api";
import { useToast } from "../context/ToastContext";
import Badge from "../components/Badge";
import Pagination from "../components/Pagination";
import { formatDateTime } from "../utils/formatDate";
import { SEVERITIES, PRIORITIES, STATUSES } from "../utils/constants";

const AdminBugs = () => {
    const navigate = useNavigate();
    const { notify } = useToast();
    const [searchParams, setSearchParams] = useSearchParams();

    const status = searchParams.get("status") || "";
    const severity = searchParams.get("severity") || "";
    const priority = searchParams.get("priority") || "";
    const page = parseInt(searchParams.get("page")) || 1;

    const [bugs, setBugs] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);

    const query = searchParams.toString();

    useEffect(() => {
        const loadBugs = async () => {
            try {
                setLoading(true);
                const data = await request(`/admin/bugs?${query}&limit=10`);
                setBugs(data.bugs);
                setTotalPages(data.totalPages);
                setTotal(data.total);
            } catch (err) {
                notify(err.message, "error");
            } finally {
                setLoading(false);
            }
        };
        loadBugs();
    }, [query, notify]);

    const setParam = (key, value) => {
        const next = new URLSearchParams(searchParams);
        if (value) next.set(key, value);
        else next.delete(key);
        if (key !== "page") next.delete("page");
        setSearchParams(next);
    };

    const title = [status, severity, priority].filter(Boolean).join(" · ");

    return (
        <div>
            <Link to="/admin" className="text-muted">
                ← Admin Panel
            </Link>

            <h2 className="page-title mt-3">
                {title ? `${title} bugs` : "All bugs"}{" "}
                <span className="text-muted fs-6">({total})</span>
            </h2>

            <Row className="g-2 mb-3">
                <Col xs={4} md={3}>
                    <Form.Select size="sm" value={status} onChange={(e) => setParam("status", e.target.value)}>
                        <option value="">Status</option>
                        {STATUSES.map((s) => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </Form.Select>
                </Col>
                <Col xs={4} md={3}>
                    <Form.Select size="sm" value={severity} onChange={(e) => setParam("severity", e.target.value)}>
                        <option value="">Severity</option>
                        {SEVERITIES.map((s) => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </Form.Select>
                </Col>
                <Col xs={4} md={3}>
                    <Form.Select size="sm" value={priority} onChange={(e) => setParam("priority", e.target.value)}>
                        <option value="">Priority</option>
                        {PRIORITIES.map((p) => (
                            <option key={p} value={p}>{p}</option>
                        ))}
                    </Form.Select>
                </Col>
                <Col md={3}>
                    {(status || severity || priority) && (
                        <Button
                            variant="outline-primary"
                            size="sm"
                            className="w-100"
                            onClick={() => setSearchParams({})}
                        >
                            Clear
                        </Button>
                    )}
                </Col>
            </Row>

            {loading && (
                <div className="text-center my-4">
                    <Spinner animation="border" variant="primary" />
                </div>
            )}

            {!loading && bugs.length === 0 && (
                <p className="text-muted text-center my-4">No bugs match this filter.</p>
            )}

            <div className="d-flex flex-column gap-2">
                {bugs.map((bug) => (
                    <Card
                        key={bug._id}
                        className="clickable-card bug-row"
                        role="button"
                        onClick={() => navigate(`/bugs/${bug._id}`)}
                    >
                        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 p-3">
                            <div style={{ minWidth: 0 }}>
                                <div className="bug-title">{bug.title}</div>
                                <div className="d-flex flex-wrap align-items-center gap-2 mt-1">
                                    <button
                                        type="button"
                                        className="project-chip"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/projects/${bug.project?._id}`);
                                        }}
                                    >
                                        📁 {bug.project?.name || "Deleted project"}
                                    </button>
                                    <small className="text-muted">
                                        {bug.reporter?.name || "Deleted user"} · {formatDateTime(bug.createdAt)}
                                    </small>
                                </div>
                            </div>
                            <div className="d-flex flex-wrap gap-1">
                                <Badge label={bug.status} />
                                <Badge label={bug.severity} />
                                <Badge label={bug.priority} />
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={(p) => setParam("page", String(p))}
            />
        </div>
    );
};

export default AdminBugs;