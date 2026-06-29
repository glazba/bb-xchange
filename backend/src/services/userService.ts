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

//! Get profile
export const getProfileById = async (
    userId: number
) => {

    const [rows] = await pool.query<RowDataPacket[]>(
        `
        SELECT
            users.id,
            users.username,
            users.email,
            users.avatar,
            users.city,
            users.bio,
            users.created_at,
            users.updated_at,
            GROUP_CONCAT(
                interests.name
                ORDER BY interests.name
                SEPARATOR '||'
            ) AS interests
        FROM users

        LEFT JOIN user_interests
            ON users.id = user_interests.user_id

        LEFT JOIN interests
            ON user_interests.interest_id = interests.id

        WHERE users.id = ?

        GROUP BY users.id
        `,
        [userId]
    );

    if (rows.length === 0) {
        return null;
    }

    return {
        ...rows[0],
        interests: rows[0].interests
            ? rows[0].interests.split("||")
            : []
    };
};

//! Update profile
export const updateProfileById = async (
    userId: number,
    username: string,
    city: string,
    bio: string
) => {

    await pool.query(
        `
        UPDATE users
        SET
            username = ?,
            city = ?,
            bio = ?
        WHERE id = ?
        `,
        [username,
            city,
            bio,
            userId
        ]
    );
};

//! Update interests
export const updateUserInterests = async (
    userId: number,
    interests: string[]
) => {

    await pool.query(
        `
        DELETE FROM user_interests
        WHERE user_id = ?
        `,
        [userId]
    );

    if (interests.length === 0) {
        return;
    }

    const [rows] = await pool.query<RowDataPacket[]>(
        `
        SELECT
            id,
            name
        FROM interests
        WHERE name IN (?)
        `,
        [interests]
    );

    for (const interest of rows) {
        await pool.query(
            `
            INSERT INTO user_interests(
                user_id,
                interest_id
            )
                VALUES (?, ?)
            `,
            [
                userId,
                interest.id
            ]
        );
    }
};
