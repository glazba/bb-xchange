import { Router } from "express";
import rateLimit from "express-rate-limit";
import { getUsers, getUser, registerUser, loginUser } from "../controllers/userController";

const router = Router();

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: {
        message: "Too many login attempts. Please try again later"
    }
});


router.post("/register", registerUser);

router.get("/", getUsers);

router.get("/:id", getUser);

router.post("/login", loginLimiter, loginUser);

export default router;