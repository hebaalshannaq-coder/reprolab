import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, Form, Button } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const { login } = useAuth();
    const { notify } = useToast();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            await login(email, password);
            navigate("/");
        } catch (err) {
            notify(err.message, "error");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="auth-wrapper">
            <Card style={{ width: "100%", maxWidth: "420px" }} className="p-4">
                <h3 className="text-center mb-1">Welcome back</h3>
                <p className="text-center text-muted mb-4">Login to ReproLab</p>

                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Button type="submit" className="w-100" disabled={submitting}>
                        {submitting ? "Logging in..." : "Login"}
                    </Button>
                </Form>

                <p className="text-center text-muted mt-3 mb-0">
                    No account? <Link to="/register">Register</Link>
                </p>
            </Card>
        </div>
    );
};

export default Login;
