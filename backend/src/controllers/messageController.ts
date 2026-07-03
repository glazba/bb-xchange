import { Response } from "express";

import { AuthRequest } from "../types/AuthRequest";
import { handleControllerError } from "../utils/handleControllerErrors";

import {
    createMessage,
    getMessagesBetweenUsers,
    markMessagesAsRead,
    getUnreadMessagesCount
} from "../services/messageService";

import {
    canAccessOffer,
    getOfferParticipants
} from "../services/tradeOffersService";

export const sendMessage = async (
    req: AuthRequest,
    res: Response
) => {

    try {
        const {
            receiverId,
            content
        } = req.body;

        const senderId = req.user!.userId;

        if (!content?.trim()) {
            return res.status(400).json({
                message: "Message content is required"
            });
        }

        const messageId = await createMessage(
            null,
            senderId,
            Number(receiverId),
            content.trim()
        );

        return res.status(201).json({
            message: "Message sent",
            messageId
        });

    } catch (error) {
        return handleControllerError(
            error,
            res
        );
    }
};


export const getMessages = async (
    req: AuthRequest,
    res: Response
) => {

    try {
        const otherUserId =
            Number(req.params.userId);

        const userId =
            req.user!.userId;

        const messages = await getMessagesBetweenUsers(
            userId,
            otherUserId);

        return res.json(messages);


    } catch (error) {
        return handleControllerError(
            error,
            res
        );
    }
};

export const readMessages = async (
    req: AuthRequest,
    res: Response
) => {

    try {

        const otherUserId = Number(
            req.params.userId
        );

        await markMessagesAsRead(
            otherUserId,
            req.user!.userId
        );

        return res.json({
            message: "Messages marked as read"
        });

    } catch (error) {
        return handleControllerError(
            error,
            res
        );
    }
};

export const unreadMessages = async (
    req: AuthRequest,
    res: Response
) => {

    try {
        const count = await getUnreadMessagesCount(
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
