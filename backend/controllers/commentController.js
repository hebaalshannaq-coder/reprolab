const Comment = require("../models/Comment");
const Bug = require("../models/Bug");
const { canModify } = require("../utils/helpers");

const getComments = async (req, res) => {
    try {
        const bug = await Bug.findById(req.params.id).select("_id");
        if (!bug) {
            return res.status(404).json({ error: "Bug not found" });
        }

        const comments = await Comment.find({ bug: bug._id })
            .populate("author", "name")
            .sort({ createdAt: 1 });

        res.json(comments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createComment = async (req, res) => {
    try {
        const bug = await Bug.findById(req.params.id).select("_id");
        if (!bug) {
            return res.status(404).json({ error: "Bug not found" });
        }

        const comment = await Comment.create({
            text: req.body.text.trim(),
            bug: bug._id,
            author: req.user._id,
        });

        await comment.populate("author", "name");

        res.status(201).json({ message: "Comment added successfully", comment });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) {
            return res.status(404).json({ error: "Comment not found" });
        }

        if (!canModify(comment.author, req.user)) {
            return res
                .status(403)
                .json({ error: "You can only delete your own comments" });
        }

        await comment.deleteOne();

        res.json({ message: "Comment deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getComments, createComment, deleteComment };