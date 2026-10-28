import { useState } from "react";
import { request } from "../api/api";
import { SEVERITIES, PRIORITIES } from "../utils/constants";

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
    const [form, setForm] = useState(emptyForm);
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSubmitting(true);

        try {
            await request(`/projects/${projectId}/bugs`, {
                method: "POST",
                body: form,
            });
            setForm(emptyForm);
            onCreated();
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h3>Report a bug</h3>
            {error && <p style={{ color: "red" }}>{error}</p>}

            <input
                name="title"
                placeholder="Title"
                value={form.title}
                onChange={handleChange}
                maxLength={100}
                required
            />
            <textarea
                name="description"
                placeholder="Description (optional)"
                value={form.description}
                onChange={handleChange}
            />
            <textarea
                name="stepsToReproduce"
                placeholder="Steps to reproduce (1. ... 2. ...)"
                value={form.stepsToReproduce}
                onChange={handleChange}
                required
            />
            <textarea
                name="expectedResult"
                placeholder="Expected result"
                value={form.expectedResult}
                onChange={handleChange}
                required
            />
            <textarea
                name="actualResult"
                placeholder="Actual result"
                value={form.actualResult}
                onChange={handleChange}
                required
            />
            <input
                name="environment"
                placeholder="Environment (e.g. Chrome 120, Windows 11)"
                value={form.environment}
                onChange={handleChange}
            />

            <select name="severity" value={form.severity} onChange={handleChange}>
                {SEVERITIES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                ))}
            </select>

            <select name="priority" value={form.priority} onChange={handleChange}>
                {PRIORITIES.map((p) => (
                    <option key={p} value={p}>{p}</option>
                ))}
            </select>

            <button type="submit" disabled={submitting}>
                {submitting ? "Saving..." : "Report bug"}
            </button>
        </form>
    );
};

export default BugForm;