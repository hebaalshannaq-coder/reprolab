const express = require("express");
const router = express.Router();

const {
    getComments,
    createComment,
    deleteComment,
} = require("../controllers/commentController");
const { protect } = require("../middleware/auth");
const { validateId, validateComment } = require("../middleware/validate");

router.get("/bugs/:id/comments", protect, validateId, getComments);
router.post(
    "/bugs/:id/comments",
    protect,
    validateId,
    validateComment,
    createComment
);
router.delete("/comments/:id", protect, validateId, deleteComment);

module.exports = router;