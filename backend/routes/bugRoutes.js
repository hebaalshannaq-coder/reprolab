const express = require("express");
const router = express.Router();

const {
    getBugs,
    createBug,
    getBugById,
    updateBug,
    deleteBug,
} = require("../controllers/bugController");

const devUser = require("../middleware/devUser");
const {
    validateId,
    validateProjectId,
    validateBugCreate,
    validateBugUpdate,
} = require("../middleware/validate");

router.get("/projects/:projectId/bugs", devUser, validateProjectId, getBugs);
router.post(
    "/projects/:projectId/bugs",
    devUser,
    validateProjectId,
    validateBugCreate,
    createBug
);

router.get("/bugs/:id", devUser, validateId, getBugById);
router.put("/bugs/:id", devUser, validateId, validateBugUpdate, updateBug);
router.delete("/bugs/:id", devUser, validateId, deleteBug);

module.exports = router;