const express = require("express");
const router = express.Router();

const {
    getUsers,
    updateUserRole,
    deleteUser,
    getStats,
} = require("../controllers/adminController");
const { protect, authorizeRole } = require("../middleware/auth");
const { validateId, validateRole } = require("../middleware/validate");

router.use(protect, authorizeRole("admin"));

router.get("/users", getUsers);
router.put("/users/:id/role", validateId, validateRole, updateUserRole);
router.delete("/users/:id", validateId, deleteUser);
router.get("/stats", getStats);

module.exports = router;