const express = require("express");
const router = express.Router();

const {
    getProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
} = require("../controllers/projectController");

const devUser = require("../middleware/devUser");
const { validateProject, validateId } = require("../middleware/validate");

router.use(devUser);

router.get("/", getProjects);
router.post("/", validateProject, createProject);
router.get("/:id", validateId, getProjectById);
router.put("/:id", validateId, validateProject, updateProject);
router.delete("/:id", validateId, deleteProject);

module.exports = router;