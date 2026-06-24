import { pool } from "../db/connections";
import { ResultSetHeader, RowDataPacket } from "mysql2";

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
