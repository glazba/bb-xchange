import { Router } from "express";
import rateLimit from "express-rate-limit";
import {
    getUsers,
    getUser,
    registerUser,
    loginUser,
    getProfile,
    updateProfile,
    uploadAvatar,
    deleteProfile
} from "../controllers/userController";
import { authMiddleware } from "../middleware/authMiddleware";
import { uploadAvatar as uploadMiddleware } from "../middleware/uploadMiddleware";
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

router.get("/id", getUserById);

router.get("/:id", getUser);

router.put("/profile", authMiddleware, updateProfile);

router.put("/avatar", authMiddleware, uploadMiddleware.single("avatar"), uploadAvatar);

router.delete("/profile", authMiddleware, deleteProfile);

export default router;