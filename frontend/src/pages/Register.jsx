import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, Form, Button } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const { register } = useAuth();
    const { notify } = useToast();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            await register(name, email, password);
            notify("Account created! Please login");
            navigate("/login");
        } catch (err) {
            notify(err.message, "error");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="auth-wrapper">
            <Card style={{ width: "100%", maxWidth: "420px" }} className="p-4">
                <h3 className="text-center mb-1">Create account</h3>
                <p className="text-center text-muted mb-4">Join ReproLab</p>

                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            maxLength={50}
                            required
                        />
                    </Form.Group>
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
                            placeholder="At least 6 characters"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            minLength={6}
                            required
                        />
                    </Form.Group>
                    <Button type="submit" className="w-100" disabled={submitting}>
                        {submitting ? "Creating account..." : "Register"}
                    </Button>
                </Form>

                <p className="text-center text-muted mt-3 mb-0">
                    Have an account? <Link to="/login">Login</Link>
                </p>
            </Card>
        </div>
    );
};

export default Register;