import bcrypt from "bcryptjs";
import { pool } from "../db/connections";
import { ResultSetHeader, RowDataPacket } from "mysql2";

//! Register
export const createUser = async (
    username: string,
    email: string,
    password: string,
    city: string,
    bio: string
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
            city,
            bio
        )
        VALUES (?,?,?,?,?)
        `,
        [
            username,
            email,
            hashedPassword,
            city,
            bio
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
export const getUserById = async (
    id: number) => {
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

//! Get user with password (Delete profile)
export const getUserWithPasswordById = async (
    userId: number
) => {

    const [rows] = await pool.query<RowDataPacket[]>(
        `
        SELECT
            id,
            password_hash
        FROM users
        WHERE id = ?
        `,
        [userId]
    );

    return rows[0];
}

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

//! Get avatar by ID
export const getAvatarById = async (
    userId: number
) => {

    const [rows] = await pool.query<RowDataPacket[]>(
        `
        SELECT avatar
        FROM users
        WHERE id = ?
        `,
        [userId]
    );

    return rows[0];
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

//! Update avatar
export const updateAvatarById = async (
    userId: number,
    avatar: string
) => {

    const [result] = await pool.query<ResultSetHeader>(
        `
        UPDATE users
        SET avatar = ?
        WHERE id = ?
        `,
        [
            avatar,
            userId
        ]
    );

    return result;
}

//! Delete user
export const deleteUserById = async (
    userId: number
) => {

    await pool.query(
        `
        DELETE FROM users
        WHERE id = ?
        `,
        [userId]
    );
};
