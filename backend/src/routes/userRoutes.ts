import { Router } from "express";
import rateLimit from "express-rate-limit";
import {
    getUsers,
    getUser,
    registerUser,
    loginUser,
    getProfile,
    updateProfile
} from "../controllers/userController";
import { authMiddleware } from "../middleware/authMiddleware";
import { getUserById } from "../services/userService";

const router = Router();

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: {
        message: "Too many login attempts. Please try again later"
    }
});

router.post("/register", registerUser);

router.post("/login", loginLimiter, loginUser);

router.get("/", getUsers);

router.get("/profile", authMiddleware, getProfile);

router.get("/:id", getUser);

router.get("/id", getUserById);

router.put("/profile", authMiddleware, updateProfile);

export default router;