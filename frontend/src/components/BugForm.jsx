import { useState } from "react";
import { Card, Form, Button, Row, Col } from "react-bootstrap";
import { request } from "../api/api";
import { useToast } from "../context/ToastContext";
import { uploadImage } from "../utils/cloudinary";
import { SEVERITIES, PRIORITIES } from "../utils/constants";

const MAX_SIZE = 5 * 1024 * 1024; // 5MB

const emptyForm = {
    title: "",
    description: "",
    stepsToReproduce: "",
    expectedResult: "",
    actualResult: "",
    environment: "",
    severity: "Minor",
    priority: "Medium",
};

const BugForm = ({ projectId, onCreated }) => {
    const { notify } = useToast();
    const [form, setForm] = useState(emptyForm);
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleFile = (e) => {
        const selected = e.target.files[0];
        if (!selected) return;

        if (!selected.type.startsWith("image/")) {
            notify("Please choose an image file", "error");
            return;
        }
        if (selected.size > MAX_SIZE) {
            notify("Image must be 5MB or smaller", "error");
            return;
        }

        setFile(selected);
        setPreview(URL.createObjectURL(selected));
    };

    const removeFile = () => {
        setFile(null);
        setPreview("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const body = { ...form };
            if (file) {
                body.screenshotUrl = await uploadImage(file);
            }

            await request(`/projects/${projectId}/bugs`, {
                method: "POST",
                body,
            });
            notify("Bug reported");
            setForm(emptyForm);
            removeFile();
            onCreated();
        } catch (err) {
            notify(err.message, "error");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Card className="p-3">
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                        name="title"
                        placeholder="Short and clear title"
                        value={form.title}
                        onChange={handleChange}
                        maxLength={100}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Description (optional)</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={2}
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Steps to reproduce</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        name="stepsToReproduce"
                        placeholder={"1. Open /login\n2. Enter a valid email\n3. Click Login"}
                        value={form.stepsToReproduce}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Row className="g-3 mb-3">
                    <Col md={6}>
                        <Form.Group>
                            <Form.Label>Expected result</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                name="expectedResult"
                                value={form.expectedResult}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group>
                            <Form.Label>Actual result</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                name="actualResult"
                                value={form.actualResult}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Row className="g-3 mb-3">
                    <Col md={6}>
                        <Form.Group>
                            <Form.Label>Environment</Form.Label>
                            <Form.Control
                                name="environment"
                                placeholder="e.g. Chrome 120, Windows 11"
                                value={form.environment}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Col>
                    <Col xs={6} md={3}>
                        <Form.Group>
                            <Form.Label>Severity</Form.Label>
                            <Form.Select name="severity" value={form.severity} onChange={handleChange}>
                                {SEVERITIES.map((s) => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col xs={6} md={3}>
                        <Form.Group>
                            <Form.Label>Priority</Form.Label>
                            <Form.Select name="priority" value={form.priority} onChange={handleChange}>
                                {PRIORITIES.map((p) => (
                                    <option key={p} value={p}>{p}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>

                <Form.Group className="mb-3">
                    <Form.Label>Screenshot (optional)</Form.Label>
                    <Form.Control type="file" accept="image/*" onChange={handleFile} />
                    {preview && (
                        <div className="mt-2">
                            <img
                                src={preview}
                                alt="Preview"
                                className="bug-screenshot"
                                style={{ maxHeight: "200px" }}
                            />
                            <div>
                                <Button
                                    variant="outline-danger"
                                    size="sm"
                                    className="mt-2"
                                    onClick={removeFile}
                                >
                                    Remove image
                                </Button>
                            </div>
                        </div>
                    )}
                </Form.Group>

                <Button type="submit" disabled={submitting}>
                    {submitting ? "Saving..." : "Report bug"}
                </Button>
            </Form>
        </Card>
    );
};

export default BugForm;