const express = require("express");
const router = express.Router();

const {
    getBugs,
    createBug,
    getBugById,
    updateBug,
    deleteBug,
} = require("../controllers/bugController");
const { getActivity } = require("../controllers/activityController");
const { protect } = require("../middleware/auth");
const {
    validateId,
    validateProjectId,
    validateBugCreate,
    validateBugUpdate,
} = require("../middleware/validate");

router.get("/projects/:projectId/bugs", protect, validateProjectId, getBugs);
router.post(
    "/projects/:projectId/bugs",
    protect,
    validateProjectId,
    validateBugCreate,
    createBug
);

router.get("/bugs/:id", protect, validateId, getBugById);
router.put("/bugs/:id", protect, validateId, validateBugUpdate, updateBug);
router.delete("/bugs/:id", protect, validateId, deleteBug);

router.get("/bugs/:id/activity", protect, validateId, getActivity);

module.exports = router;