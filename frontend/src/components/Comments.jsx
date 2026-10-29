import { useState } from "react";
import { request } from "../api/api";
import { useAuth } from "../context/AuthContext";

const Comments = ({ bugId, comments, onChanged }) => {
    const { user } = useAuth();
    const [text, setText] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSubmitting(true);

        try {
            await request(`/bugs/${bugId}/comments`, {
                method: "POST",
                body: { text },
            });
            setText("");
            onChanged();
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (commentId) => {
        if (!window.confirm("Delete this comment?")) return;

        try {
            await request(`/comments/${commentId}`, { method: "DELETE" });
            onChanged();
        } catch (err) {
            setError(err.message);
        }
    };

    const canDelete = (comment) =>
        user.role === "admin" || comment.author?._id === user._id;

    return (
        <div>
            {comments.length === 0 && <p>No comments yet.</p>}

            <ul>
                {comments.map((comment) => (
                    <li key={comment._id}>
                        <strong>{comment.author?.name || "Deleted user"}</strong>
                        <small> · {new Date(comment.createdAt).toLocaleString()}</small>
                        <p>{comment.text}</p>
                        {canDelete(comment) && (
                            <button onClick={() => handleDelete(comment._id)}>Delete</button>
                        )}
                    </li>
                ))}
            </ul>

            <form onSubmit={handleSubmit}>
                {error && <p style={{ color: "red" }}>{error}</p>}
                <textarea
                    placeholder="Write a comment..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    maxLength={1000}
                    required
                />
                <button type="submit" disabled={submitting}>
                    {submitting ? "Sending..." : "Add comment"}
                </button>
            </form>
        </div>
    );
};

export default Comments;