import { Router } from "express";
import { createBook, getBook } from "../controllers/bookController";

const router = Router();


router.post("/", createBook);


router.get("/:itemId", getBook);


export default router;