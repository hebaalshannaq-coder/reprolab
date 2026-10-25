const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
    try {
        const header = req.headers.authorization;

        if (!header || !header.startsWith("Bearer ")) {
            return res.status(401).json({ error: "Not authorized, no token" });
        }

        const token = header.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id).select("-password");
        if (!user) {
            return res.status(401).json({ error: "User no longer exists" });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ error: "Not authorized, invalid token" });
    }
};

const authorizeRole = (requiredRole) => {
    return (req, res, next) => {
        if (req.user.role !== requiredRole) {
            return res
                .status(403)
                .json({ error: "Forbidden: insufficient permissions" });
        }
        next();
    };
};

module.exports = { protect, authorizeRole };