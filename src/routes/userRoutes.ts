import { Router } from "express";
import { getUsers, getUser, registerUser } from "../controllers/userController";

const router = Router();

router.post("/register", registerUser);

router.get("/", getUsers);

router.get("/:id", getUser);

export default router;