const mongoose = require("mongoose");
const {
    SEVERITIES,
    PRIORITIES,
    STATUSES,
    ROLES,
} = require("../config/constants");

const isNonEmptyString = (value) =>
    typeof value === "string" && value.trim().length > 0;

const EMAIL_REGEX = /^\S+@\S+\.\S+$/;


const checkBugFields = (body) => {
    if (body.severity !== undefined && !SEVERITIES.includes(body.severity)) {
        return `severity must be one of: ${SEVERITIES.join(", ")}`;}
    if (body.priority !== undefined && !PRIORITIES.includes(body.priority)) {
        return `priority must be one of: ${PRIORITIES.join(", ")}`;}
    if (body.status !== undefined && !STATUSES.includes(body.status)) {
        return `status must be one of: ${STATUSES.join(", ")}`;}
    if (body.description !== undefined && typeof body.description !== "string") {
        return "description must be a string";}
    if (body.environment !== undefined && typeof body.environment !== "string") {
        return "environment must be a string";}
    return null;
};


const validateId = (req, res, next) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({ error: "Invalid id" });}
    next();
};

const validateProjectId = (req, res, next) => {
    if (!mongoose.isValidObjectId(req.params.projectId)) {
        return res.status(400).json({ error: "Invalid project id" });}
    next();
};


const validateRegister = (req, res, next) => {
    const { name, email, password } = req.body || {};

    if (!isNonEmptyString(name)) {
        return res.status(400).json({ error: "name is required" });}
    if (name.trim().length > 50) {
        return res.status(400).json({ error: "name must be 50 characters or less" });
    
    }
    if (!isNonEmptyString(email) || !EMAIL_REGEX.test(email.trim())) {
        return res.status(400).json({ error: "A valid email is required" });
    }
    if (typeof password !== "string" || password.length < 6 || password.length > 72) {
        return res
            .status(400)
            .json({ error: "password must be between 6 and 72 characters" });}
    next();
};

const validateLogin = (req, res, next) => {
    const { email, password } = req.body || {};

    if (!isNonEmptyString(email) || typeof password !== "string" || !password) {
        return res.status(400).json({ error: "email and password are required" });
    }

    next();
};


const validateProject = (req, res, next) => {
    const { name, description } = req.body || {};

    if (!isNonEmptyString(name)) {return res.status(400).json({ error: "Project name is required" });}
    if (name.trim().length > 80) { return res.status(400).json({ error: "Name must be 80 characters or less" });}
    if (description !== undefined && typeof description !== "string") {
        return res.status(400).json({ error: "Description must be a string" });
    }

    next();
};

const validateBugCreate = (req, res, next) => {
    const body = req.body || {};
    const requiredFields = [
        "title",
        "stepsToReproduce",
        "expectedResult",
        "actualResult",
    ];

    for (const field of requiredFields) {
        if (!isNonEmptyString(body[field])) {
            return res.status(400).json({ error: `${field} is required` });
        }
    }
    if (body.title.trim().length > 100) {
        return res.status(400).json({ error: "title must be 100 characters or less" });
    }

    const fieldsError = checkBugFields(body);
    if (fieldsError) {
        return res.status(400).json({ error: fieldsError });
    }

    next();
};
const validateBugUpdate = (req, res, next) => {
    const body = req.body || {};

    if (Object.keys(body).length === 0) {
        return res.status(400).json({ error: "No fields to update" });
    }

    const textFields = ["title", "stepsToReproduce", "expectedResult", "actualResult"];
    for (const field of textFields) {
        if (body[field] !== undefined && !isNonEmptyString(body[field])) {
            return res.status(400).json({ error: `${field} cannot be empty` });
        }
    }

    if (body.title !== undefined && body.title.trim().length > 100) {
        return res.status(400).json({ error: "title must be 100 characters or less" });
    }

    if (
        body.assignee !== undefined &&
        body.assignee !== null &&
        !mongoose.isValidObjectId(body.assignee)
    ) {
        return res.status(400).json({ error: "Invalid assignee id" });
    }

    const fieldsError = checkBugFields(body);
    if (fieldsError) {
        return res.status(400).json({ error: fieldsError });
    }

    next();
};

const validateComment = (req, res, next) => {
    const { text } = req.body || {};

    if (!isNonEmptyString(text)) {
        return res.status(400).json({ error: "text is required" });
    }
    if (text.trim().length > 1000) {
        return res.status(400).json({ error: "text must be 1000 characters or less" });
    }

    next();
};

const validateRole = (req, res, next) => {
    const { role } = req.body || {};

    if (!ROLES.includes(role)) {
        return res.status(400).json({ error: `role must be one of: ${ROLES.join(", ")}` });
    }

    next();
};

module.exports = {
    validateId,
    validateProjectId,
    validateRegister,
    validateLogin,
    validateProject,
    validateBugCreate,
    validateBugUpdate,
    validateComment,
    validateRole,
};