import { Request, Response } from "express";
import { AuthRequest } from "../types/AuthRequest";
import { getAllItems, getItemById, getItemsByOwnerId, createItem, deleteItemById, updateItemById } from "../services/itemService";


export const getItems = async (
    req: Request,
    res: Response
) => {

    const items = await getAllItems();

    res.json(items);
};

export const getItem = async (
    req: Request,
    res: Response
) => {

    const item = await getItemById(
        String(req.params.id)
    );

    if (item.length === 0) {
        return res.status(404).json({
            message: "Item not found"
        });
    }

    res.json(item[0]);
};

export const getMyItems = async (
    req: AuthRequest,
    res: Response
) => {

    const ownerId = req.user!.userId;

    const items = await getItemsByOwnerId(
        ownerId
    );

    res.json(items);
};


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

export const deleteItem = async (
    req: AuthRequest,
    res: Response
) => {

    const item = await getItemById(
        String(req.params.id)
    );

    if (item.length === 0) {
        return res.status(404).json({
            message: "Item not found"
        });
    }

    if (item[0].owner_id !== req.user!.userId) {
        return res.status(403).json({
            message: "Forbidden"
        });
    }

    await deleteItemById(
        String(req.params.id)
    );

    res.json({
        message: "Item deleted"
    });
};


export const updateItem = async (
    req: AuthRequest,
    res: Response
) => {

    const item = await getItemById(
        String(req.params.id)
    );

    if (item.length === 0) {
        return res.status(404).json({
            message: "Item not found"
        });
    }

    if (item[0].owner_id !== req.user!.userId) {
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

    res.json({
        message: "Item updated"
    });
};

