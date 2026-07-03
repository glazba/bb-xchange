import { Router } from "express";

import { authMiddleware } from "../middleware/authMiddleware";

import {
    notifications,
    readNotification,
    unreadNotifications
} from "../controllers/notificationController";

const router = Router();

router.use(authMiddleware);

router.get("/", notifications);

router.get("/unread-count", unreadNotifications);

router.patch("/:id/read", readNotification);

export default router;