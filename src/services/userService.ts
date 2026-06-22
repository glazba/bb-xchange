import { pool } from "../db/connections";

export const getAllUsers = async () => {
    const [rows] = await pool.query(
        `
        SELECT id, username, city
        FROM users
        `
    );

    return rows
};

export const getUserById = (id: string) => {
    return {
        id,
        username: "peter",
        city: "Budapest"
    };
};
