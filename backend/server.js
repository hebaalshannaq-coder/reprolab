require("dotenv").config();
const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");


const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const projectRoutes = require("./routes/projectRoutes");
const bugRoutes = require("./routes/bugRoutes");
const commentRoutes = require("./routes/commentRoutes");



const app = express();

const corsOptions = process.env.FRONTEND_URL
    ? { origin: process.env.FRONTEND_URL }
    : {};
app.use(cors(corsOptions));
app.use(express.json());

app.get("/", (req, res) => {
    res.json({ message: "ReproLab API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api", bugRoutes);
app.use("/api", commentRoutes);


app.use((req, res) => {
    res.status(404).json({ error: "Route not found" });
});

app.use((err, req, res, next) => {
    if (err.type === "entity.parse.failed") {
        return res.status(400).json({ error: "Invalid JSON body" });
    }
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`server run on http://localhost:${PORT}`);
    });
});