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

//! Get all items
export const getAllItems = async () => {

    const [rows] = await pool.query<RowDataPacket[]>(
        `
        SELECT
            id,
            owner_id,
            type,
            title,
            description,
            item_condition,
            status
        FROM items
        `
    );

    return rows;
};

//! Get item by ID
export const getItemById = async (id: string) => {
    const [rows] = await pool.query<RowDataPacket[]>(
        `
        SELECT
            id,
            owner_id,
            type,
            title,
            description,
            item_condition,
            status
        FROM items
        WHERE id = ?
        `,
        [id]
    );

    return rows;
};

//! Get all items of owner 
export const getItemsByOwnerId = async (
    ownerId: number
) => {

    const [rows] = await pool.query<RowDataPacket[]>(
        `
        SELECT
            id,
            owner_id,
            type,
            title,
            description,
            item_condition,
            status
        FROM items
        WHERE owner_id = ?
        `,
        [ownerId]
    );

    return rows;
};

//! Modify item
export const updateItemById = async (
    id: string,
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

//! Delete item
export const deleteItemById = async (
    id: string
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
