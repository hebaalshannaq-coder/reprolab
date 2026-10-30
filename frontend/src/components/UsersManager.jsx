import { useCallback, useEffect, useState } from "react";
import { Form, Button, Spinner, Table } from "react-bootstrap";
import { request } from "../api/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import Pagination from "./Pagination";
import useDebounce from "../hooks/useDebounce";
import { ROLES } from "../utils/constants";

const UsersManager = ({ onChanged }) => {
    const { user: currentUser } = useAuth();
    const { notify } = useToast();

    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search);
    const [loading, setLoading] = useState(true);

    const loadUsers = useCallback(async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({ page, limit: 8 });
            if (debouncedSearch.trim()) params.set("search", debouncedSearch.trim());

            const data = await request(`/admin/users?${params.toString()}`);
            setUsers(data.users);
            setTotalPages(data.totalPages);
            setTotal(data.total);
        } catch (err) {
            notify(err.message, "error");
        } finally {
            setLoading(false);
        }
    }, [page, debouncedSearch, notify]);

    useEffect(() => {
        loadUsers();
    }, [loadUsers]);

    useEffect(() => {
        setPage(1);
    }, [debouncedSearch]);

    const handleRoleChange = async (target, newRole) => {
        try {
            await request(`/admin/users/${target._id}/role`, {
                method: "PUT",
                body: { role: newRole },
            });
            notify(`${target.name} is now ${newRole}`);
            await loadUsers();
            onChanged();
        } catch (err) {
            notify(err.message, "error");
        }
    };

    const handleDelete = async (target) => {
        if (!window.confirm(`Delete user "${target.name}"?`)) return;

        try {
            await request(`/admin/users/${target._id}`, { method: "DELETE" });
            notify(`${target.name} was deleted`);
            await loadUsers();
            onChanged();
        } catch (err) {
            notify(err.message, "error");
        }
    };

    return (
        <div>
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
                <h6 className="mb-0">
                    All users <span className="text-muted">({total})</span>
                </h6>
                <Form.Control
                    size="sm"
                    style={{ maxWidth: "280px" }}
                    placeholder="🔍 Search name or email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {loading && (
                <div className="text-center my-3">
                    <Spinner animation="border" size="sm" variant="primary" />
                </div>
            )}

            {!loading && users.length === 0 && (
                <p className="text-muted text-center my-3">No users found.</p>
            )}

            {users.length > 0 && (
                <Table responsive hover className="align-middle users-table mb-0">
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Role</th>
                            <th className="d-none d-md-table-cell">Joined</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((u) => {
                            const isSelf = u._id === currentUser._id;
                            return (
                                <tr key={u._id}>
                                    <td>
                                        <div className="d-flex align-items-center gap-2">
                                            <div className={`avatar ${u.role === "admin" ? "admin" : ""}`}>
                                                {u.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div style={{ minWidth: 0 }}>
                                                <div className="fw-semibold">
                                                    {u.name}{" "}
                                                    {isSelf && <small className="text-muted">(you)</small>}
                                                </div>
                                                <small className="text-muted">{u.email}</small>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <Form.Select
                                            size="sm"
                                            style={{ width: "auto" }}
                                            value={u.role}
                                            onChange={(e) => handleRoleChange(u, e.target.value)}
                                            disabled={isSelf}
                                        >
                                            {ROLES.map((r) => (
                                                <option key={r} value={r}>{r}</option>
                                            ))}
                                        </Form.Select>
                                    </td>
                                    <td className="d-none d-md-table-cell text-muted">
                                        {new Date(u.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="text-end">
                                        <Button
                                            variant="outline-danger"
                                            size="sm"
                                            onClick={() => handleDelete(u)}
                                            disabled={isSelf}
                                        >
                                            Delete
                                        </Button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </Table>
            )}

            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
    );
};

export default UsersManager;