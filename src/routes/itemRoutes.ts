import { Router } from "express";
import { getItems, getItem, createNewitem } from "../controllers/itemController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();


router.get("/", getItems);

router.get("/:id", getItem);


router.post("/", authMiddleware, createNewitem);


export default router;