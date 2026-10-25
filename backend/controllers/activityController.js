const ActivityLog = require("../models/ActivityLog");
const Bug = require("../models/Bug");

const getActivity = async (req, res) => {
    try {
        const bug = await Bug.findById(req.params.id).select("_id");
        if (!bug) {
            return res.status(404).json({ error: "Bug not found" });
        }

        const activity = await ActivityLog.find({ bug: bug._id })
            .populate("user", "name")
            .sort({ createdAt: 1 });

        res.json(activity);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getActivity };