import { Router } from "express";
import { createNewitem } from "../controllers/itemController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.post(
    "/", authMiddleware, createNewitem
);

export default router;