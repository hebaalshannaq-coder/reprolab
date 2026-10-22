const mongoose = require("mongoose");

const validateProject = (req, res, next) => {
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

const validateId = (req, res, next) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({ error: "Invalid id" });
    }
    next();
};

module.exports = { validateProject, validateId };