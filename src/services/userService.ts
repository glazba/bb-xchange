import { pool } from "../db/connections";
import { ResultSetHeader, RowDataPacket } from "mysql2";


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

export const createUser = async (
    username: string,
    email: string,
    password: string,
    city: string
) => {
    const [result] = await pool.query<ResultSetHeader>(
        `
        
        INSERT INTO users (
            username, 
            email,
            password_hash,
            city
        )
        VALUES (?,?,?,?)
        `,
        [
            username,
            email,
            password,
            city
        ]
    );

    return result.insertId;
};
