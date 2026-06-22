import { Router } from "express";
import { getUsers, getUser, registerUser, loginUser } from "../controllers/userController";

const router = Router();

router.post("/register", registerUser);

router.get("/", getUsers);

router.get("/:id", getUser);

router.post("/login", loginUser);

export default router;