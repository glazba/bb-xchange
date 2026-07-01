import { Router } from "express";
import { createNewItem, getItems, getItem, getMyItems, deleteItem, updateItem } from "../controllers/itemController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.post("/", authMiddleware, createNewItem);

router.get("/", getItems);

router.get("/me", authMiddleware, getMyItems);

router.get("/:id", getItem);

router.put("/:id", authMiddleware, updateItem);

router.delete("/:id", authMiddleware, deleteItem);

export default router;