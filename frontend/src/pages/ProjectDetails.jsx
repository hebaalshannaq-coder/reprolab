import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Row, Col, Card, Form, Button, Spinner } from "react-bootstrap";
import { request } from "../api/api";
import Badge from "../components/Badge";
import Pagination from "../components/Pagination";
import useDebounce from "../hooks/useDebounce";
import { SEVERITIES, PRIORITIES, STATUSES } from "../utils/constants";

const ProjectDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [project, setProject] = useState(null);
    const [bugs, setBugs] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [severity, setSeverity] = useState("");
    const [priority, setPriority] = useState("");
    const debouncedSearch = useDebounce(search);

    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState("");

    useEffect(() => {
        const loadProject = async () => {
            try {
                const data = await request(`/projects/${id}`);
                setProject(data);
            } catch (err) {
                setLoadError(err.message);
            }
        };
        loadProject();
    }, [id]);

    const loadBugs = useCallback(async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({ page, limit: 8 });
            if (debouncedSearch.trim()) params.set("search", debouncedSearch.trim());
            if (status) params.set("status", status);
            if (severity) params.set("severity", severity);
            if (priority) params.set("priority", priority);

            const data = await request(`/projects/${id}/bugs?${params.toString()}`);
            setBugs(data.bugs);
            setTotalPages(data.totalPages);
            setTotal(data.total);
        } catch (err) {
            setLoadError(err.message);
        } finally {
            setLoading(false);
        }
    }, [id, page, debouncedSearch, status, severity, priority]);

    useEffect(() => {
        loadBugs();
    }, [loadBugs]);

    useEffect(() => {
        setPage(1);
    }, [debouncedSearch, status, severity, priority]);

    const clearFilters = () => {
        setSearch("");
        setStatus("");
        setSeverity("");
        setPriority("");
    };

    const hasFilters = search || status || severity || priority;

    if (loadError) {
        return (
            <div className="text-center my-5">
                <p className="text-muted">{loadError}</p>
                <Link to="/">← Back to projects</Link>
            </div>
        );
    }

    return (
        <div>
            <Link to="/" className="text-muted">
                ← Projects
            </Link>

            {project && (
                <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mt-3 mb-4">
                    <div>
                        <h2 className="page-title mb-1">{project.name}</h2>
                        <p className="text-muted mb-1">
                            {project.description || "No description"}
                        </p>
                        <small className="text-muted">
                            Owner: {project.owner?.name || "Deleted user"}
                        </small>
                    </div>
                    <Button onClick={() => navigate(`/projects/${id}/bugs/new`)}>
                        + Report bug
                    </Button>
                </div>
            )}

            <h5 className="mb-2">
                Bugs <span className="text-muted">({total})</span>
            </h5>

            <Row className="g-2 mb-3">
                <Col md={5}>
                    <Form.Control
                        size="sm"
                        placeholder="🔍 Search by title..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </Col>
                <Col xs={4} md={2}>
                    <Form.Select size="sm" value={status} onChange={(e) => setStatus(e.target.value)}>
                        <option value="">Status</option>
                        {STATUSES.map((s) => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </Form.Select>
                </Col>
                <Col xs={4} md={2}>
                    <Form.Select size="sm" value={severity} onChange={(e) => setSeverity(e.target.value)}>
                        <option value="">Severity</option>
                        {SEVERITIES.map((s) => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </Form.Select>
                </Col>
                <Col xs={4} md={2}>
                    <Form.Select size="sm" value={priority} onChange={(e) => setPriority(e.target.value)}>
                        <option value="">Priority</option>
                        {PRIORITIES.map((p) => (
                            <option key={p} value={p}>{p}</option>
                        ))}
                    </Form.Select>
                </Col>
                <Col md={1}>
                    {hasFilters && (
                        <Button variant="outline-primary" size="sm" className="w-100" onClick={clearFilters}>
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
                <Card className="p-4 text-center">
                    <p className="text-muted mb-2">No bugs found.</p>
                    <div>
                        <Button size="sm" onClick={() => navigate(`/projects/${id}/bugs/new`)}>
                            + Report the first bug
                        </Button>
                    </div>
                </Card>
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
                                <small className="text-muted">
                                    By {bug.reporter?.name || "Deleted user"}
                                    {bug.assignee && ` · Assigned to ${bug.assignee.name}`}
                                    {" · "}
                                    {new Date(bug.createdAt).toLocaleDateString()}
                                </small>
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

            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
    );
};

export default ProjectDetails;