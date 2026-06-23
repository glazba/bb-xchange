import { pool } from "../db/connections";
import { ResultSetHeader } from "mysql2";

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
