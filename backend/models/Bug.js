const mongoose = require("mongoose");

const bugSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true, maxlength: 100 },
        description: { type: String, default: "" },
        stepsToReproduce: { type: String, required: true },
        expectedResult: { type: String, required: true },
        actualResult: { type: String, required: true },
        environment: { type: String, default: "" },
        severity: {
            type: String,
            enum: ["Critical", "Major", "Minor"],
            default: "Minor",
        },
        priority: {
            type: String,
            enum: ["High", "Medium", "Low"],
            default: "Medium",
        },
        status: {
            type: String,
            enum: ["New", "In Progress", "Fixed", "Verified", "Closed"],
            default: "New",
        },
        project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
        reporter: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        assignee: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        screenshotUrl: { type: String },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Bug", bugSchema);