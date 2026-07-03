import { AuthRequest } from "../types/AuthRequest";
import { Response } from "express";

import { handleControllerError } from "../utils/handleControllerErrors";

import {
    getNotifications,
    markNotificationAsRead,
    getUnreadNotificationsCount
} from "../services/notificationService";

export const notifications = async (
    req: AuthRequest,
    res: Response
) => {

    try {

        const data = await getNotifications(
            req.user!.userId
        );

        return res.json(data);

    } catch (error) {
        return handleControllerError(
            error,
            res
        );
    }
};

export const readNotification = async (
    req: AuthRequest,
    res: Response
) => {

    try {

        await markNotificationAsRead(
            Number(req.params.id),
            req.user!.userId
        );

        return res.json({
            message: "Notification marked as read"
        });

    } catch (error) {
        return handleControllerError(
            error,
            res
        );
    }
};

export const unreadNotifications = async (
    req: AuthRequest,
    res: Response
) => {

    try {

        const count = await getUnreadNotificationsCount(
            req.user!.userId
        );

        return res.json({
            unreadCount: count
        });

    } catch (error) {
        return handleControllerError(
            error,
            res
        );
    }
};
