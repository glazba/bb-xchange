import { RowDataPacket } from "mysql2";
import { pool } from "../db/connections";

export const getAllUsers = async () => {
    const [rows] = await pool.query<RowDataPacket[]>(
        `
        SELECT id, username, city
        FROM users
        `
    );

    return rows
};

export const getUserById = async (id: string) => {
    const [rows] = await pool.query<RowDataPacket[]>(
        `
        SELECT
            id,
            username,
            city,
            bio
        FROM users
        WHERE id = ?
        `,
        [id]
    );

    return rows;
};
