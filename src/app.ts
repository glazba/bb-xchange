import express from "express";
import userRoutes from "./routes/userRoutes";
import { pool } from "./db/connections";

import { authMiddleware } from "./middleware/authMiddleware";

const app = express();


app.use(express.json());

app.use("/users", userRoutes);


app.get("/", (req, res) => {
    res.send("Hello BB-Xchange");
});

app.get("/about", (req, res) => {
    res.send("BB-Xchange backend");
});

app.get("/health", (req, res) => {
    res.json({
        status: "ok"
    });
});

app.get("/health/db", async (req, res) => {
    try {
        const connection = await pool.getConnection();
        connection.release();
        res.json({
            status: "Database connected"
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            status: "Database connection failed"
        });
    }
});

app.get("/profile/:id", (req, res) => {
    res.json({
        profileId: req.params.id
    });
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});

app.get("/protected", authMiddleware, (req, res) => {
    res.json({
        message: "Protected route"
    });
});