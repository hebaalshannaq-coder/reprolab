const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema(
    {
        bug: { type: mongoose.Schema.Types.ObjectId, ref: "Bug", required: true },
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        action: { type: String, required: true }, // created, status_changed, assigned
        from: { type: String },
        to: { type: String },
    },
    { timestamps: true }
);

module.exports = mongoose.model("ActivityLog", activityLogSchema);