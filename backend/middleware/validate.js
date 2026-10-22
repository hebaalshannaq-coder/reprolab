const mongoose = require("mongoose");
const { SEVERITIES, PRIORITIES, STATUSES } = require("../config/constants");

const isNonEmptyString = (value) =>
    typeof value === "string" && value.trim().length > 0;

const checkBugFields = (body) => {
    if (body.severity !== undefined && !SEVERITIES.includes(body.severity)) {
        return `severity must be one of: ${SEVERITIES.join(", ")}`;
    }
    if (body.priority !== undefined && !PRIORITIES.includes(body.priority)) {
        return `priority must be one of: ${PRIORITIES.join(", ")}`;
    }
    if (body.status !== undefined && !STATUSES.includes(body.status)) {
        return `status must be one of: ${STATUSES.join(", ")}`;
    }
    if (body.description !== undefined && typeof body.description !== "string") {
        return "description must be a string";
    }
    if (body.environment !== undefined && typeof body.environment !== "string") {
        return "environment must be a string";
    }
    return null;
};

const validateProject = (req,res,next) => {
    const { name, description } = req.body;

    if (!name || typeof name !== "string" || !name.trim()) {
        return res.status(400).json({ error: "Project name is required" });
    }

    if (name.trim().length > 80) {
        return res.status(400).json({ error: "Name must be 80 characters or less" });
    }

    if (description !== undefined && typeof description !== "string") {
        return res.status(400).json({ error: "Description must be a string" });
    }

    next();
};

const validateId = (req,res,next) =>  {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({ error: "Invalid id" });
    }
    next();
};

const validateProjectId = (req, res, next) => {
    if (!mongoose.isValidObjectId(req.params.projectId)) {
        return res.status(400).json({ error: "Invalid project id" });
    }
    next();
};

const validateBugCreate = (req,res,next) =>{
    const body = req.body;

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
    const body = req.body;

    if (!body || Object.keys(body).length === 0) {
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

module.exports = {
    validateProject,
    validateId,
    validateProjectId,
    validateBugCreate,
    validateBugUpdate,
};