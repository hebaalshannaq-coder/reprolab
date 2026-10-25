const getPagination = (query) => {
    const page = Math.max(parseInt(query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(query.limit) || 10, 1), 50);
    const skip = (page - 1) * limit;
    return { page, limit, skip };
};


const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");


const canModify = (ownerId, user) =>
    user.role === "admin" || ownerId.toString() === user._id.toString();

module.exports = { getPagination, escapeRegex, canModify };