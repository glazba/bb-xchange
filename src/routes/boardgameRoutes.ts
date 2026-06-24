import { Router } from "express";
import { createBoardgame, getBoardgame } from "../controllers/boardgameController";

const router = Router();


router.post("/", createBoardgame);


router.get("/:itemId", getBoardgame);


export default router;