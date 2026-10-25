const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS) || 10;

const toSafeUser = (user) => ({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
});

const generateToken = (userId) =>
    jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });


const register = async (req, res) => {
    try {
        const name = req.body.name.trim();
        const email = req.body.email.trim().toLowerCase();
        const { password } = req.body;

        const exists = await User.findOne({ email });
        if (exists) {
            return res.status(409).json({ error: "Email already in use" });
        }

        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        res.status(201).json({
            message: "User registered successfully",
            user: toSafeUser(user),
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ error: "Email already in use" });
        }
        res.status(500).json({ error: error.message });
    }
};

const login = async (req, res) => {
    try {
        const email = req.body.email.trim().toLowerCase();
        const { password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        res.json({
            message: "Login successful",
            token: generateToken(user._id),
            user: toSafeUser(user),
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getMe = (req, res) => {
    res.json({ user: toSafeUser(req.user) });
};

module.exports = { register, login, getMe };