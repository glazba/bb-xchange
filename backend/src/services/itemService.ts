import { pool } from "../db/connections";
import { ResultSetHeader, RowDataPacket } from "mysql2";

//! Create new item
export const createItem = async (
    ownerId: number,
    type: string,
    title: string,
    description: string,
    itemCondition: string
) => {

    const [result] = await pool.query<ResultSetHeader>(
        `
        INSERT INTO items (
            owner_id,
            type,
            title,
            description,
            item_condition
        )
        VALUES (?,?,?,?,?)
        `,
        [
            ownerId,
            type,
            title,
            description,
            itemCondition
        ]
    );

    return result.insertId;
};

//! Get all active items
export const getAllItems = async () => {

    const [rows] = await pool.query<RowDataPacket[]>(
        `
        SELECT
            items.id,
            items.owner_id,
            items.type,
            cover.image_url AS cover_image,
            items.title,
            items.description,
            items.item_condition,
            items.status,
            items.created_at,
            items.updated_at,

            book_details.author,
            COALESCE(
                book_details.genre,
                boardgame_details.genre
            ) AS genre,

            book_details.page_count,
            book_details.published_year,
            book_details.isbn,

            boardgame_details.min_players,
            boardgame_details.max_players,
            boardgame_details.recommended_age,
            boardgame_details.playtime

        FROM items

        LEFT JOIN book_details
            ON items.id = book_details.item_id
        
        LEFT JOIN boardgame_details
            ON items.id = boardgame_details.item_id

        LEFT JOIN item_images cover
            ON items.id = cover.item_id
            AND cover.is_cover = TRUE

        WHERE items.status = 'active'

        ORDER BY items.created_at DESC
        `
    );

    return rows;
};

//! Get item by ID
export const getItemById = async (
    id: number
) => {
    const [rows] = await pool.query<RowDataPacket[]>(
        `
        SELECT
            items.id,
            items.owner_id,
            users.username AS owner_name,
            items.type,
            cover.image_url AS cover_image,
            items.title,
            items.description,
            items.item_condition,
            items.status,
            items.created_at,
            items.updated_at
        FROM items

        JOIN users
            ON items.owner_id = users.id

        LEFT JOIN item_images cover
            ON items.id = cover.item_id
            AND cover.is_cover = TRUE

        WHERE items.id = ?
        `,
        [id]
    );

    return rows[0];
};

//! Get all items of owner
export const getItemsByOwnerId = async (
    ownerId: number
) => {

    const [rows] = await pool.query<RowDataPacket[]>(
        `
        SELECT
            items.id,
            items.owner_id,
            items.type,
            cover.image_url AS cover_image,
            items.title,
            items.description,
            items.item_condition,
            items.status,
            items.created_at,
            items.updated_at

        FROM items

        LEFT JOIN item_images cover
            ON items.id = cover.item_id
            AND cover.is_cover = TRUE

        WHERE items.owner_id = ?

        ORDER BY items.created_at DESC
        `,
        [ownerId]
    );

    return rows;
};

//! Get active items by owner ID (Public profile)
export const getActiveItemsByOwnerId = async (
    ownerId: number
) => {

    const [rows] = await pool.query<RowDataPacket[]>(
        `
        SELECT
            items.id,
            items.owner_id,
            items.type,
            cover.image_url AS cover_image,
            items.title,
            items.description,
            items.item_condition,
            items.status,
            items.created_at,
            items.updated_at

        FROM items

        LEFT JOIN item_images cover
            ON items.id = cover.item_id
            AND cover.is_cover = TRUE

        WHERE items.owner_id = ?
            AND items.status = 'active'
        
        ORDER BY items.created_at DESC
        `,
        [ownerId]
    );

    return rows;
};

//! Modify item
export const updateItemById = async (
    id: number,
    type: string,
    title: string,
    description: string,
    itemCondition: string
) => {

    const [result] = await pool.query<ResultSetHeader>(
        `
        UPDATE items
        SET
            type = ?,
            title = ?,
            description = ?,
            item_condition = ?
        WHERE id = ?
        `,
        [
            type,
            title,
            description,
            itemCondition,
            id
        ]
    );

    return result;
};

//! Update item status
export const updateItemStatus = async (
    itemId: number,
    status: string
) => {
    await pool.query(
        `
        UPDATE items
        SET status = ?
        WHERE id = ?
        `,
        [
            status,
            itemId
        ]
    );
};

//! Create item image
export const createItemImage = async (
    itemId: number,
    imageUrl: string,
    isCover: boolean
) => {

    const [result] = await pool.query<ResultSetHeader>(
        `
        INSERT INTO item_images (
            item_id,
            image_url,
            is_cover
        )
        VALUES (?, ?, ?)
        `,
        [
            itemId,
            imageUrl,
            isCover
        ]
    );

    return result;
};

//! Get item images
export const getImagesByItemId = async (
    itemId: number
) => {

    const [rows] = await pool.query<RowDataPacket[]>(
        `
        SELECT
            id,
            item_id,
            image_url,
            is_cover,
            created_at
        FROM item_images
        WHERE item_id = ?
        ORDER BY
            is_cover DESC,
            created_at ASC
        `,
        [itemId]
    );

    return rows;
};

//! Get item image by ID
export const getItemImageById = async (
    imageId: number
) => {

    const [rows] = await pool.query<RowDataPacket[]>(
        `
            SELECT
                id,
                item_id,
                image_url,
                is_cover
            FROM item_images
            WHERE id = ?
            `,
        [imageId]
    );

    return rows[0];
};

export const countImagesByItemId = async (
    itemId: number
) => {
    const [rows] = await pool.query<RowDataPacket[]>(
        `
        SELECT COUNT(*) AS count
        FROM item_images
        WHERE item_id = ?
        `,
        [itemId]
    );

    return rows[0].count;
};

//! Delete all item images by item ID
export const deleteImagesByItemId = async (
    itemId: number
) => {

    await pool.query(
        `
            DELETE FROM item_images
            WHERE item_id = ?
            `,
        [itemId]
    );
};

//! Delete one item image
export const deleteItemImageById = async (
    imageId: number
) => {

    await pool.query(
        `
        DELETE FROM item_images
        WHERE id = ?
        `,
        [imageId]
    );
};

//! Romove cover image
export const removeCoverFromItem = async (
    itemId: number
) => {
    await pool.query(
        `
        UPDATE item_images
        SET is_cover = FALSE
        WHERE item_id = ?
        `,
        [itemId]
    );
};

//! Set cover image
export const setCoverImage = async (
    imageId: number
) => {
    await pool.query(
        `
        UPDATE item_images
        SET is_cover = TRUE
        WHERE id = ?
        `,
        [imageId]
    );
};

//! Get oldest image
export const getOldestImageByItemId = async (
    itemId: number
) => {
    const [rows] = await pool.query<RowDataPacket[]>(
        `
        SELECT
            id,
            item_id,
            image_url,
            is_cover
        FROM item_images
        WHERE item_id = ?
        ORDER BY created_at ASC
        LIMIT 1
        `,
        [itemId]
    );

    return rows[0];
};

//! Delete one item
export const deleteItemById = async (
    id: number
) => {

    const [result] = await pool.query<ResultSetHeader>(
        `
        DELETE FROM items
        WHERE id = ?
        `,
        [id]
    );

    return result;
};
