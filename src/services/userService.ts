import bcrypt from "bcryptjs";
import { pool } from "../db/connections";
import { ResultSetHeader, RowDataPacket } from "mysql2";

//! Register
export const createUser = async (
    username: string,
    email: string,
    password: string,
    city: string
) => {

    const hashedPassword = await bcrypt.hash(
        password,
        10
    );

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
            hashedPassword,
            city
        ]
    );

    return result.insertId;
};

//! Get all users
export const getAllUsers = async () => {
    const [rows] = await pool.query<RowDataPacket[]>(
        `
        SELECT id, username, city
        FROM users
        `
    );

    return rows;
};

//! Get user by ID
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

//! Login
export const getUserByEmail = async (
    email: string
) => {
    const [rows] = await pool.query<RowDataPacket[]>(
        `
        SELECT *
        FROM users
        WHERE email = ?
        `,
        [email]
    );

    return rows;
};
