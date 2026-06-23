import { Request, Response } from "express";
import { AuthRequest } from "../types/AuthRequest";
import { getAllItems, getItemById, createItem } from "../services/itemService";


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
