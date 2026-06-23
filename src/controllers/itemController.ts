import { Response } from "express";
import { AuthRequest } from "../types/AuthRequest";
import { createItem } from "../services/itemService";

export const createNewitem = async (
    req: AuthRequest,
    res: Response
) => {

    const {
        type,
        title,
        description,
        itemCondition
    } = req.body;

    const owner_id = req.user!.userId;

    const itemId = await createItem(
        owner_id,
        type,
        title,
        description,
        itemCondition
    );

    res.status(201).json({
        message: "Item created",
        itemId
    });
};
