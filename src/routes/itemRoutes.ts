import { Router } from "express";
import { getItems, getItem, getMyItems, createNewitem, deleteItem, updateItem } from "../controllers/itemController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();


router.get("/", getItems);

router.get("/me", authMiddleware, getMyItems);

router.get("/:id", getItem);


router.post("/", authMiddleware, createNewitem);


router.put("/:id", authMiddleware, updateItem);


router.delete("/:id", authMiddleware, deleteItem);

export default router;