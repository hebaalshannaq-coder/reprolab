import { useCallback, useEffect, useState } from "react";
import { request } from "../api/api";
import { useAuth } from "../context/AuthContext";
import Pagination from "./Pagination";
import useDebounce from "../hooks/useDebounce";
import { ROLES } from "../utils/constants";

const UsersManager = ({ onChanged }) => {
    const { user: currentUser } = useAuth();

    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [actionError, setActionError] = useState("");
    const [message, setMessage] = useState("");

    const loadUsers = useCallback(async () => {
        try {
            setLoading(true);
            setError("");
            const params = new URLSearchParams({ page, limit: 8 });
            if (debouncedSearch.trim()) params.set("search", debouncedSearch.trim());

            const data = await request(`/admin/users?${params.toString()}`);
            setUsers(data.users);
            setTotalPages(data.totalPages);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [page, debouncedSearch]);

    useEffect(() => {
        loadUsers();
    }, [loadUsers]);

    useEffect(() => {
        setPage(1);
    }, [debouncedSearch]);

    const handleRoleChange = async (target, newRole) => {
        setActionError("");
        setMessage("");

        try {
            await request(`/admin/users/${target._id}/role`, {
                method: "PUT",
                body: { role: newRole },
            });
            setMessage(`${target.name} is now ${newRole}`);
            await loadUsers();
            onChanged();
        } catch (err) {
            setActionError(err.message);
        }
    };

    const handleDelete = async (target) => {
        if (!window.confirm(`Delete user "${target.name}"?`)) return;

        setActionError("");
        setMessage("");

        try {
            await request(`/admin/users/${target._id}`, { method: "DELETE" });
            setMessage(`${target.name} was deleted`);
            await loadUsers();
            onChanged();
        } catch (err) {
            setActionError(err.message);
        }
    };

    return (
        <div>
            <input
                type="text"
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            {error && <p style={{ color: "red" }}>{error}</p>}
            {actionError && <p style={{ color: "red" }}>{actionError}</p>}
            {message && <p style={{ color: "green" }}>{message}</p>}
            {loading && <p>Loading...</p>}
            {!loading && !error && users.length === 0 && <p>No users found.</p>}

            {users.length > 0 && (
                <div style={{ overflowX: "auto" }}>
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Joined</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((u) => {
                                const isSelf = u._id === currentUser._id;
                                return (
                                    <tr key={u._id}>
                                        <td>
                                            {u.name} {isSelf && <small>(you)</small>}
                                        </td>
                                        <td>{u.email}</td>
                                        <td>
                                            <select
                                                value={u.role}
                                                onChange={(e) => handleRoleChange(u, e.target.value)}
                                                disabled={isSelf}
                                            >
                                                {ROLES.map((r) => (
                                                    <option key={r} value={r}>{r}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                                        <td>
                                            <button onClick={() => handleDelete(u)} disabled={isSelf}>
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
    );
};

export default UsersManager;