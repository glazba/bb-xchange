import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";

import {
    sendMessage,
    getMessages,
    readMessages,
    unreadMessages
} from "../controllers/messageController";

const router = Router();

router.use(authMiddleware);

router.post("/", sendMessage);

router.get("/user/:userId", getMessages);

router.patch("/user/:userId/read", readMessages);

router.get("/unread-count", unreadMessages);

export default router;