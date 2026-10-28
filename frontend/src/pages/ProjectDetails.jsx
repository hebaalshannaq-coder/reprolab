import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { request } from "../api/api";
import Badge from "../components/Badge";
import BugForm from "../components/BugForm";
import Pagination from "../components/Pagination";
import useDebounce from "../hooks/useDebounce";
import { SEVERITIES, PRIORITIES, STATUSES } from "../utils/constants";

const ProjectDetails = () => {
    const { id } = useParams();

    const [project, setProject] = useState(null);
    const [bugs, setBugs] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [severity, setSeverity] = useState("");
    const [priority, setPriority] = useState("");
    const debouncedSearch = useDebounce(search);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    useEffect(() => {
        const loadProject = async () => {
            try {
                const data = await request(`/projects/${id}`);
                setProject(data);
            } catch (err) {
                setError(err.message);
            }
        };
        loadProject();
    }, [id]);

    const loadBugs = useCallback(async () => {
        try {
            setLoading(true);
            setError("");
            const params = new URLSearchParams({ page, limit: 8 });
            if (debouncedSearch.trim()) params.set("search", debouncedSearch.trim());
            if (status) params.set("status", status);
            if (severity) params.set("severity", severity);
            if (priority) params.set("priority", priority);

            const data = await request(`/projects/${id}/bugs?${params.toString()}`);
            setBugs(data.bugs);
            setTotalPages(data.totalPages);
        } catch (err) {
            setError(err.message);
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

    const handleCreated = () => {
        setPage(1);
        loadBugs();
    };

    const hasFilters = search || status || severity || priority;

    return (
        <div>
            <Link to="/"> ← Back to projects</Link>

            {project && (
                <>
                    <h2>{project.name}</h2>
                    <p>{project.description}</p>
                    <small>Owner: {project.owner?.name || "Deleted user"}</small>
                </>
            )}

            <hr />
            <BugForm projectId={id} onCreated={handleCreated} />
            <hr />

            <h3>Bugs</h3>

            <input
                type="text"
                placeholder="Search by title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="">All statuses</option>
                {STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                ))}
            </select>

            <select value={severity} onChange={(e) => setSeverity(e.target.value)}>
                <option value="">All severities</option>
                {SEVERITIES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                ))}
            </select>

            <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                <option value="">All priorities</option>
                {PRIORITIES.map((p) => (
                    <option key={p} value={p}>{p}</option>
                ))}
            </select>

            {hasFilters && <button onClick={clearFilters}>Clear filters</button>}

            {error && <p style={{ color: "red" }}>{error}</p>}
            {loading && <p>Loading...</p>}
            {!loading && !error && bugs.length === 0 && <p>No bugs found.</p>}

            <ul>
                {bugs.map((bug) => (
                    <li key={bug._id}>
                        <Link to={`/bugs/${bug._id}`}>
                            <strong>{bug.title}</strong>
                        </Link>
                        <div>
                            <Badge label={bug.status} />
                            <Badge label={bug.severity} />
                            <Badge label={bug.priority} />
                        </div>
                        <small>
                            By {bug.reporter?.name || "Deleted user"}
                            {bug.assignee && ` · Assigned to ${bug.assignee.name}`}
                        </small>
                    </li>
                ))}
            </ul>

            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
    );
};

export default ProjectDetails;