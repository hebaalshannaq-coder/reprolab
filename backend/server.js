require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const projectRoutes = require("./routes/projectRoutes");
const bugRoutes = require("./routes/bugRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({ message: "ReproLab API is running" });
});

app.use("/api/projects", projectRoutes);
app.use("/api", bugRoutes);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`server run on http://localhost:${PORT}`);
    });
});