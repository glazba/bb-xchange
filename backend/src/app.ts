import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

//! DB connection
import { pool } from "./db/connections";

//! Types and middleware
import { AuthRequest } from "./types/AuthRequest";
import { authMiddleware } from "./middleware/authMiddleware";

//! Routes
import userRoutes from "./routes/userRoutes";
import itemRoutes from "./routes/itemRoutes";
import bookRoutes from "./routes/bookRoutes";
import boardgameRoutes from "./routes/boardgameRoutes";
import tradeOfferRoutes from "./routes/tradeOfferRoutes";
import { log } from "node:console";

const app = express();

//! API Rate Limiter
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        message: "Too many requests. Please try again later."
    }
});

//! Middlewares
app.use(express.json());

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(helmet());

app.use((
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
) => {
    console.error(err);
    return res.status(500).json({
        message: "Internal server error"
    });
});

app.use(apiLimiter);

//! API Routes
app.use("/users", userRoutes);
app.use("/items", itemRoutes);
app.use("/books", bookRoutes);
app.use("/boardgames", boardgameRoutes);
app.use("/offers", tradeOfferRoutes);

//! Basic endpoint
app.get("/", (req, res) => {
    res.send("Hello BB-Xchange");
});

//! Health check
app.get("/health", (req, res) => {
    res.json({
        status: "ok"
    });
});

//! DB connection check
app.get("/health/db", async (req, res) => {
    try {
        const connection = await pool.getConnection();
        connection.release();
        res.json({
            status: "Database connected"
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            status: "Database connection failed"
        });
    }
});

//! JWT test endpoint
app.get("/protected", authMiddleware, (req: AuthRequest, res) => {
    res.json({
        message: "Protected route",
        user: req.user
    });
});

//! Server launch
app.listen(3000, () => {
    console.log("Server running on port 3000");
});
