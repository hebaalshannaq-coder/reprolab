const User = require("../models/User");
const Project = require("../models/Project");
const Bug = require("../models/Bug");
const Comment = require("../models/Comment");
const { STATUSES, SEVERITIES } = require("../config/constants");
const { getPagination, escapeRegex } = require("../utils/helpers");

const fillCounts = (allValues, aggregated) => {
    const result = {};
    allValues.forEach((value) => {
        result[value] = 0;
    });
    aggregated.forEach((row) => {
        result[row._id] = row.count;
    });
    return result;
};

const getUsers = async (req, res) => {
    try {
        const { search } = req.query;
        const { page, limit, skip } = getPagination(req.query);

        const filter = {};
        if (typeof search === "string" && search.trim()) {
            const regex = { $regex: escapeRegex(search.trim()), $options: "i" };
            filter.$or = [{ name: regex }, { email: regex }];
        }

        const total = await User.countDocuments(filter);
        const users = await User.find(filter)
            .select("-password")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.json({
            users,
            page,
            totalPages: Math.ceil(total / limit),
            total,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateUserRole = async (req, res) => {
    try {
        if (req.params.id === req.user._id.toString()) {
            return res.status(400).json({ error: "You cannot change your own role" });
        }

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        user.role = req.body.role;
        await user.save();

        res.json({
            message: "User role updated successfully",
            user: { _id: user._id, name: user.name, email: user.email, role: user.role },
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        if (req.params.id === req.user._id.toString()) {
            return res.status(400).json({ error: "You cannot delete yourself" });
        }

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const ownsProject = await Project.exists({ owner: user._id });
        const reportedBug = await Bug.exists({ reporter: user._id });
        if (ownsProject || reportedBug) {
            return res.status(409).json({
                error: "User owns projects or bugs. Delete or reassign them first",
            });
        }

        await Comment.deleteMany({ author: user._id });
        await Bug.updateMany({ assignee: user._id }, { $set: { assignee: null } });
        await user.deleteOne();

        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



const getStats = async (req, res) => {
    try {
        const [totalUsers, totalProjects, totalBugs, byStatus, bySeverity] =
            await Promise.all([
                User.countDocuments(),
                Project.countDocuments(),
                Bug.countDocuments(),
                Bug.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
                Bug.aggregate([{ $group: { _id: "$severity", count: { $sum: 1 } } }]),
            ]);

        res.json({
            totalUsers,
            totalProjects,
            totalBugs,
            bugsByStatus: fillCounts(STATUSES, byStatus),
            bugsBySeverity: fillCounts(SEVERITIES, bySeverity),
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getUsers, updateUserRole, deleteUser, getStats };