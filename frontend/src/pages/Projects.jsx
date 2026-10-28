import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { request } from "../api/api";
import { useAuth } from "../context/AuthContext";
import Pagination from "../components/Pagination";
import useDebounce from "../hooks/useDebounce";

const Projects = () => {
    const { user } = useAuth();

    const [projects, setProjects] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [formError, setFormError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const loadProjects = useCallback(async () => {
        try {
            setLoading(true);
            setError("");
            const params = new URLSearchParams({ page, limit: 6 });
            if (debouncedSearch.trim()) params.set("search", debouncedSearch.trim());

            const data = await request(`/projects?${params.toString()}`);
            setProjects(data.projects);
            setTotalPages(data.totalPages);
        } catch (err) {
            setError(err.message);
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
        setFormError("");
        setSubmitting(true);

        try {
            await request("/projects", {
                method: "POST",
                body: { name, description },
            });
            setName("");
            setDescription("");
            setPage(1);
            await loadProjects();
        } catch (err) {
            setFormError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this project and all its bugs?")) return;

        try {
            await request(`/projects/${id}`, { method: "DELETE" });
            await loadProjects();
        } catch (err) {
            alert(err.message);
        }
    };

    const canDelete = (project) =>
        user.role === "admin" || project.owner?._id === user._id;

    return (
        <div>
            <h2>Projects</h2>

            <form onSubmit={handleCreate}>
                <h3>New project</h3>
                {formError && <p style={{ color: "red" }}>{formError}</p>}
                <input
                    type="text"
                    placeholder="Project name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={80}
                    required
                />
                <input
                    type="text"
                    placeholder="Description (optional)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    maxLength={500}
                />
                <button type="submit" disabled={submitting}>
                    {submitting ? "Creating..." : "Create"}
                </button>
            </form>

            <hr />

            <input
                type="text"
                placeholder="Search projects..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            {error && <p style={{ color: "red" }}>{error}</p>}
            {loading && <p>Loading...</p>}

            {!loading && !error && projects.length === 0 && (
                <p>No projects found.</p>
            )}

            <ul>
                {projects.map((project) => (
                    <li key={project._id}>
                        <Link to={`/projects/${project._id}`}>
                            <strong>{project.name}</strong>
                        </Link>
                        <p>{project.description}</p>
                        <small>By {project.owner?.name || "Deleted user"}</small>
                        {canDelete(project) && (
                            <button onClick={() => handleDelete(project._id)}>Delete</button>
                        )}
                    </li>
                ))}
            </ul>

            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
    );
};

export default Projects;