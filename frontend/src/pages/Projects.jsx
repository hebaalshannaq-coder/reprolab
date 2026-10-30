import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col, Card, Form, Button, Spinner } from "react-bootstrap";
import { request } from "../api/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import Pagination from "../components/Pagination";
import useDebounce from "../hooks/useDebounce";

const Projects = () => {
    const { user } = useAuth();
    const { notify } = useToast();
    const navigate = useNavigate();

    const [projects, setProjects] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState("");

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const loadProjects = useCallback(async () => {
        try {
            setLoading(true);
            setLoadError("");
            const params = new URLSearchParams({ page, limit: 6 });
            if (debouncedSearch.trim()) params.set("search", debouncedSearch.trim());

            const data = await request(`/projects?${params.toString()}`);
            setProjects(data.projects);
            setTotalPages(data.totalPages);
        } catch (err) {
            setLoadError(err.message);
        } finally {
            setLoading(false);
        }
    }, [page, debouncedSearch]);

    useEffect(() => {
        loadProjects();
    }, [loadProjects]);

    useEffect(() => {
        setPage(1);
    }, [debouncedSearch]);

    const handleCreate = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            await request("/projects", {
                method: "POST",
                body: { name, description },
            });
            notify("Project created");
            setName("");
            setDescription("");
            setPage(1);
            await loadProjects();
        } catch (err) {
            notify(err.message, "error");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this project and all its bugs?")) return;

        try {
            await request(`/projects/${id}`, { method: "DELETE" });
            notify("Project deleted");
            await loadProjects();
        } catch (err) {
            notify(err.message, "error");
        }
    };

    const canDelete = (project) =>
        user.role === "admin" || project.owner?._id === user._id;

    return (
        <div>
            <h2 className="page-title">Projects</h2>

            <Card className="p-3 mb-3">
                <Form onSubmit={handleCreate}>
                    <h6 className="mb-3">New project</h6>
                    <Row className="g-2">
                        <Col md={4}>
                            <Form.Control
                                placeholder="Project name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                maxLength={80}
                                required
                            />
                        </Col>
                        <Col md={6}>
                            <Form.Control
                                placeholder="Description (optional)"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                maxLength={500}
                            />
                        </Col>
                        <Col md={2}>
                            <Button type="submit" className="w-100" disabled={submitting}>
                                {submitting ? "Creating..." : "Create"}
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Card>

            <Form.Control
                size="sm"
                className="mb-3"
                placeholder="🔍 Search projects..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            {loadError && <p className="text-center text-muted my-4">{loadError}</p>}

            {loading && (
                <div className="text-center my-4">
                    <Spinner animation="border" variant="primary" />
                </div>
            )}

            {!loading && !loadError && projects.length === 0 && (
                <p className="text-muted text-center my-4">No projects found.</p>
            )}

            <Row xs={1} md={2} lg={3} className="g-3">
                {projects.map((project) => (
                    <Col key={project._id}>
                        <Card
                            className="h-100 clickable-card"
                            role="button"
                            onClick={() => navigate(`/projects/${project._id}`)}
                        >
                            <Card.Body className="d-flex flex-column">
                                <Card.Title className="mb-2">{project.name}</Card.Title>
                                <Card.Text className="text-muted flex-grow-1">
                                    {project.description || "No description"}
                                </Card.Text>
                                <div className="d-flex justify-content-between align-items-center">
                                    <small className="text-muted">
                                        By {project.owner?.name || "Deleted user"}
                                    </small>
                                    {canDelete(project) && (
                                        <Button
                                            variant="outline-danger"
                                            size="sm"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(project._id);
                                            }}
                                        >
                                            Delete
                                        </Button>
                                    )}
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
    );
};

export default Projects;