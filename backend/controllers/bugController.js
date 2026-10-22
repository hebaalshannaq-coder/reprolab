const Bug = require("../models/Bug");
const Project = require("../models/Project");
const User = require("../models/User");
const Comment = require("../models/Comment");
const ActivityLog = require("../models/ActivityLog");
const { SEVERITIES, PRIORITIES, STATUSES } = require("../config/constants");
const { getPagination, escapeRegex } = require("../utils/helpers");



const getBugs = async (req,res) =>{
    try{
        const project = await Project.findById(req.params.projectId);
        if (!project){
            return res.status(404).json({ error: "Project not found" });
        }

        const {search,status,severity,priority  } = req.query;
        const { page, limit, skip } = getPagination(req.query);

        const filter = { project: project._id };

        if (status) {
            if (!STATUSES.includes(status)) {
                return res.status(400).json({ error: "Invalid status filter" });
            }
            filter.status = status;
        }

        if (severity) {
            if (!SEVERITIES.includes(severity)) {
                return res.status(400).json({ error: "Invalid severity filter" });
            }
            filter.severity = severity;
        }

        if (priority) {
            if (!PRIORITIES.includes(priority)) {
                return res.status(400).json({ error: "Invalid priority filter" });
            }
            filter.priority = priority;
        }

        if (typeof search === "string" && search.trim()) {
            filter.title = { $regex: escapeRegex(search.trim()), $options: "i" };
        }

        const total = await Bug.countDocuments(filter);
        const bugs = await Bug.find(filter)
            .populate("reporter", "name")
            .populate("assignee", "name")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.json({
            bugs,
            page,
            totalPages: Math.ceil(total / limit),
            total,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const createBug = async (req, res) => {
    try {
        const project = await Project.findById(req.params.projectId);
        if (!project) {
            return res.status(404).json({ error: "Project not found" });
        }

        const {
            title,
            description,
            stepsToReproduce,
            expectedResult,
            actualResult,
            environment,
            severity,
            priority,
        } = req.body;

        const bug = await Bug.create({
            title,
            description,
            stepsToReproduce,
            expectedResult,
            actualResult,
            environment,
            severity,
            priority,
            project: project._id,
            reporter: req.user._id,
        });

        await ActivityLog.create({
            bug: bug._id,
            user: req.user._id,
            action: "created",
        });

        res.status(201).json({ message: "Bug created successfully", bug });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getBugById = async (req,res) => {
    try {
        const bug = await Bug.findById(req.params.id)
            .populate("project", "name")
            .populate("reporter", "name email")
            .populate("assignee", "name email");

        if (!bug) {
            return res.status(404).json({ error: "Bug not found" });
        }

        res.json(bug);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateBug = async (req, res) => {
    try {
        const bug = await Bug.findById(req.params.id);
        if (!bug) {
            return res.status(404).json({ error: "Bug not found" });
        }


        const { assignee } = req.body;
        if (assignee) {
            const assigneeUser = await User.findById(assignee);
            if (!assigneeUser) {
                return res.status(400).json({ error: "Assignee user not found" });
            }
        }

        const oldStatus = bug.status;
        const oldAssignee = bug.assignee ? bug.assignee.toString() : null;

        const allowedFields = [
            "title",
            "description",
            "stepsToReproduce",
            "expectedResult",
            "actualResult",
            "environment",
            "severity",
            "priority",
            "status",
            "assignee",
        ];

        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                bug[field] = req.body[field];
            }
        });

        await bug.save();

        if (bug.status !== oldStatus) {
            await ActivityLog.create({
                bug: bug._id,
                user: req.user._id,
                action: "status_changed",
                from: oldStatus,
                to: bug.status,
            });
        }

        const newAssignee = bug.assignee ? bug.assignee.toString() : null;
        if (newAssignee !== oldAssignee) {
            await ActivityLog.create({
                bug: bug._id,
                user: req.user._id,
                action: "assigned",
                from: oldAssignee || "none",
                to: newAssignee || "none",
            });
        }

        res.json({ message: "Bug updated successfully", bug });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteBug = async (req, res) => {
    try {
        const bug = await Bug.findById(req.params.id);
        if (!bug) {
            return res.status(404).json({ error: "Bug not found" });
        }

        await Comment.deleteMany({ bug: bug._id });
        await ActivityLog.deleteMany({ bug: bug._id });
        await bug.deleteOne();

        res.json({ message: "Bug deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getBugs, createBug, getBugById, updateBug, deleteBug };