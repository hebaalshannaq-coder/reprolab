const Project = require("../models/Project");
const Bug = require("../models/Bug");
const Comment = require("../models/Comment");
const ActivityLog = require("../models/ActivityLog");
const { getPagination, escapeRegex } = require("../utils/helpers");

const getProjects = async (req, res) => {
    try {
        const { search } = req.query;
        const { page, limit, skip } = getPagination(req.query);

        const filter = {};
        if (typeof search === "string" && search.trim()) {
            filter.name = { $regex: escapeRegex(search.trim()), $options: "i" };
        }

        const total = await Project.countDocuments(filter);
        const projects = await Project.find(filter)
            .populate("owner", "name email")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.json({
            projects,
            page,
            totalPages: Math.ceil(total / limit),
            total,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id).populate(
            "owner",
            "name email"
        );

        if (!project) {
            return res.status(404).json({ error: "Project not found" });
        }

        res.json(project);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createProject = async (req, res) => {
    try {
        const { name, description } = req.body;

        const project = await Project.create({
            name,
            description,
            owner: req.user._id,
        });

        res.status(201).json({ message: "Project created successfully", project });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ error: "Project not found" });
        }

        const { name, description } = req.body;
        project.name = name;
        if (description !== undefined) project.description = description;

        await project.save();

        res.json({ message: "Project updated successfully", project });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ error: "Project not found" });
        }

        const bugs = await Bug.find({ project: project._id }).select("_id");
        const bugIds = bugs.map((bug) => bug._id);

        await Comment.deleteMany({ bug: { $in: bugIds } });
        await ActivityLog.deleteMany({ bug: { $in: bugIds } });
        await Bug.deleteMany({ project: project._id });
        await project.deleteOne();

        res.json({ message: "Project deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
};