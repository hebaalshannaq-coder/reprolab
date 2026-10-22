const User = require("../models/User");

const devUser = async (req, res, next) => {
    try {
        let user = await User.findOne({ email: "dev@reprolab.com" });

        if (!user) {
            user = await User.create({
                name: "Dev User",
                email: "dev@reprolab.com",
                password: "temporary",
                role: "admin",
            });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = devUser;