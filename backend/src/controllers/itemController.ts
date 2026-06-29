import { Request, Response } from "express";
import { AuthRequest } from "../types/AuthRequest";

import { getAllItems, getItemById, getItemsByOwnerId, createItem, deleteItemById, updateItemById } from "../services/itemService";
import { getBookByItemId } from "../services/bookService";
import { getBoardgameByItemId } from "../services/boardgameService";
import { log } from "node:console";

//! Create item
export const createNewItem = async (
    req: AuthRequest,
    res: Response
) => {

    const {
        type,
        title,
        description,
        itemCondition
    } = req.body;

    const ownerId = req.user!.userId;

    const itemId = await createItem(
        ownerId,
        type,
        title,
        description,
        itemCondition
    );

    if (!type || !title || !itemCondition) {
        return res.status(400).json({
            message: "Missing required fields"
        });
    }

    return res.status(201).json({
        message: "Item created",
        itemId
    });
};

//! Get all items
export const getItems = async (
    req: Request,
    res: Response
) => {

    const items = await getAllItems();

    return res.json(items);
};

//! Get item by ID
export const getItem = async (
    req: Request,
    res: Response
) => {
    try {

        const item = await getItemById(
            String(req.params.id)
        );

        if (!item) {
            return res.status(404).json({
                message: "Item not found"
            });
        }

        if (item.type === "book") {

            const book = await getBookByItemId(
                String(req.params.id)
            );

            return res.json({
                ...item,
                ...book[0]
            });
        }

        if (item.type === "boardgame") {

            const boardgame = await getBoardgameByItemId(
                String(req.params.id)
            );

            return res.json({
                ...item,
                ...boardgame[0]
            });
        }

        return res.json(item);

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};
//! Get items of owner
export const getMyItems = async (
    req: AuthRequest,
    res: Response
) => {
    try {
        const ownerId = req.user!.userId;

        const items = await getItemsByOwnerId(
            ownerId
        );

        return res.json(items);

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

//! Modify item
export const updateItem = async (
    req: AuthRequest,
    res: Response
) => {

    try {
        const item = await getItemById(
            String(req.params.id)
        );

        if (!item) {
            return res.status(404).json({
                message: "Item not found"
            });
        }

        if (item.owner_id !== req.user!.userId) {
            return res.status(403).json({
                message: "Forbidden"
            });
        }

        const {
            type,
            title,
            description,
            itemCondition
        } = req.body;

        await updateItemById(
            String(req.params.id),
            type,
            title,
            description,
            itemCondition
        );

        if (!type || !title || !itemCondition) {
            return res.status(400).json({
                message: "Missing required fields"
            });
        }

        return res.json({
            message: "Item updated"
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

//! Delete item
export const deleteItem = async (
    req: AuthRequest,
    res: Response
) => {

    try {
        const item = await getItemById(
            String(req.params.id)
        );

        if (!item) {
            return res.status(404).json({
                message: "Item not found"
            });
        }

        if (item.owner_id !== req.user!.userId) {
            return res.status(403).json({
                message: "Forbidden"
            });
        }

        if (item.status !== "active") {
            return res.status(400).json({
                message: "This item cannot be deleted"
            });
        }

        await deleteItemById(
            String(req.params.id)
        );

        return res.json({
            message: "Item deleted"
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};
