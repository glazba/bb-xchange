import { Request, Response } from "express";
import { AuthRequest } from "../types/AuthRequest";
import fs from "fs";
import path from "path";

/* import { messages } from "../utils/messages"; */
import { handleControllerError } from "../utils/handleControllerErrors";

import {
    getAllItems,
    getItemById,
    getItemsByOwnerId,
    createItem,
    deleteItemById,
    createItemImage,
    getImagesByItemId,
    getItemImageById,
    deleteItemImageById,
    updateItemById,
}
    from "../services/itemService";

import { cancelOffersByDeletedItem } from "../services/tradeOffersService";
import { createBookDetails, getBookByItemId, updateBookDetails } from "../services/bookService";
import { createBoardgameDetails, getBoardgameByItemId, updateBoardgameDetails } from "../services/boardgameService";

//! Create item
export const createNewItem = async (
    req: AuthRequest,
    res: Response
) => {

    const {
        type,
        title,
        description,
        item_condition,

        author,
        genre,
        page_count,
        published_year,
        isbn,

        min_players,
        max_players,
        recommended_age,
        playtime
    } = req.body;

    const ownerId = req.user!.userId;

    if (!type || !title || !item_condition) {
        return res.status(400).json({
            message: "Missing required fields"
        });
    }

    const itemId = await createItem(
        ownerId,
        type,
        title,
        description,
        item_condition
    );

    if (type === "book") {
        await createBookDetails(
            itemId,
            author ?? "",
            genre ?? "",
            page_count ?? null,
            published_year ?? null,
            isbn ?? null
        );
    }

    if (type === "boardgame") {
        await createBoardgameDetails(
            itemId,
            genre ?? "",
            min_players ?? null,
            max_players ?? null,
            recommended_age ?? null,
            playtime ?? null
        );
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
            Number(req.params.id)
        );

        if (!item) {
            return res.status(404).json({
                message: "Item not found"
            });
        }

        if (item.type === "book") {

            const book = await getBookByItemId(
                Number(req.params.id)
            );

            return res.json({
                ...item,
                ...book[0]
            });
        }

        if (item.type === "boardgame") {

            const boardgame = await getBoardgameByItemId(
                Number(req.params.id)
            );

            return res.json({
                ...item,
                ...boardgame[0]
            });
        }

        return res.json(item);

    } catch (error) {
        return handleControllerError(
            error,
            res
        );
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
        return handleControllerError(
            error,
            res
        );
    }
};

//! Modify item
export const updateItem = async (
    req: AuthRequest,
    res: Response
) => {

    try {
        const item = await getItemById(
            Number(req.params.id)
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
            item_condition,

            author,
            genre,
            page_count,
            published_year,
            isbn,

            min_players,
            max_players,
            recommended_age,
            playtime
        } = req.body;

        if (!type || !title || !item_condition) {
            return res.status(400).json({
                message: "Missing required fields"
            });
        }

        await updateItemById(
            Number(req.params.id),
            type,
            title,
            description,
            item_condition
        );

        if (type === "book") {
            await updateBookDetails(
                Number(req.params.id),
                author ?? "",
                genre ?? "",
                page_count ?? null,
                published_year ?? null,
                isbn ?? null
            );
        }

        if (type === "boardgame") {
            await updateBoardgameDetails(
                Number(req.params.id),
                genre ?? "",
                min_players ?? null,
                max_players ?? null,
                recommended_age ?? null,
                playtime ?? null
            );
        }

        return res.json({
            message: "Item updated"
        });

    } catch (error) {
        return handleControllerError(
            error,
            res
        );
    }
};

//! Delete item
export const deleteItem = async (
    req: AuthRequest,
    res: Response
) => {

    try {
        const item = await getItemById(
            Number(req.params.id)
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

        await cancelOffersByDeletedItem(item.id);

        await deleteItemById(
            Number(req.params.id)
        );

        return res.json({
            message: "Item deleted"
        });

    } catch (error) {
        return handleControllerError(
            error,
            res
        );
    }
};

//! Upload item images
export const uploadImages = async (
    req: AuthRequest,
    res: Response
) => {

    try {
        const item = await getItemById(
            Number(req.params.id)
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

        const files =
            req.files as Express.Multer.File[];

        if (!files || files.length === 0
        ) {
            return res.status(400).json({
                message: "No images uploaded"
            });
        }

        if (files.length > 5) {
            return res.status(400).json({
                message: "Maximum 5 images allowed"
            });
        }

        for (let i = 0; i < files.length; i++) {
            const file = files[i];

            await createItemImage(
                item.id,
                `items/${file.filename}`,
                i === 0
            );
        }

        return res.status(201).json({
            message: "Images uploaded successfully"
        });

    } catch (error) {
        return handleControllerError(
            error,
            res
        );
    }
};

//! Get item images
export const getItemImages = async (
    req: Request,
    res: Response
) => {

    try {
        const images = await getImagesByItemId(
            Number(req.params.id)
        );

        return res.json(images);

    } catch (error) {
        return handleControllerError(
            error,
            res
        );
    }
};

//! Delete item image
export const deleteItemImage = async (
    req: AuthRequest,
    res: Response
) => {

    try {
        const image = await getItemImageById(
            Number(req.params.imageId)
        );

        if (!image) {
            return res.status(404).json({
                message:
                    "Image not found"
            });
        }

        const item = await getItemById(
            Number(image.item_id)
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

        const imagePath = path.join(
            __dirname,
            "../../uploads",
            image.image_url
        );

        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }

        await deleteItemImageById(image.id);

        return res.json({
            message: "Image deleted"
        });

    } catch (error) {
        return handleControllerError(
            error,
            res
        );
    }
};