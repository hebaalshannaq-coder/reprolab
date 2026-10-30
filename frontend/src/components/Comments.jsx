import { useState } from "react";
import { Card, Form, Button } from "react-bootstrap";
import { request } from "../api/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const Comments = ({ bugId, comments, onChanged }) => {
    const { user } = useAuth();
    const { notify } = useToast();
    const [text, setText] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            await request(`/bugs/${bugId}/comments`, {
                method: "POST",
                body: { text },
            });
            notify("Comment added");
            setText("");
            onChanged();
        } catch (err) {
            notify(err.message, "error");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (commentId) => {
        if (!window.confirm("Delete this comment?")) return;

        try {
            await request(`/comments/${commentId}`, { method: "DELETE" });
            notify("Comment deleted");
            onChanged();
        } catch (err) {
            notify(err.message, "error");
        }
    };

    const canDelete = (comment) =>
        user.role === "admin" || comment.author?._id === user._id;

    return (
        <div>
            {comments.length === 0 && (
                <p className="text-muted">No comments yet. Be the first!</p>
            )}

            <div className="d-flex flex-column gap-2 mb-3">
                {comments.map((comment) => (
                    <Card key={comment._id} className="p-3">
                        <div className="d-flex justify-content-between align-items-start gap-2">
                            <div>
                                <strong>{comment.author?.name || "Deleted user"}</strong>
                                <small className="text-muted">
                                    {" "}· {new Date(comment.createdAt).toLocaleString()}
                                </small>
                            </div>
                            {canDelete(comment) && (
                                <Button
                                    variant="outline-danger"
                                    size="sm"
                                    onClick={() => handleDelete(comment._id)}
                                >
                                    Delete
                                </Button>
                            )}
                        </div>
                        <p className="mb-0 mt-2" style={{ whiteSpace: "pre-wrap" }}>
                            {comment.text}
                        </p>
                    </Card>
                ))}
            </div>

            <Form onSubmit={handleSubmit}>
                <Form.Control
                    as="textarea"
                    rows={3}
                    className="mb-2"
                    placeholder="Write a comment..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    maxLength={1000}
                    required
                />
                <Button type="submit" disabled={submitting}>
                    {submitting ? "Sending..." : "Add comment"}
                </Button>
            </Form>
        </div>
    );
};

export default Comments;