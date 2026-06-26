import { pool } from "../db/connections";
import { ResultSetHeader, RowDataPacket } from "mysql2";

//! Create boardgame details
export const createBoardgameDetails = async (
    itemId: number,
    genre: string,
    minPlayers: number,
    maxPlayers: number,
    recommendedAge: number,
    playtime: number | null
) => {

    const [result] = await pool.query<ResultSetHeader>(
        `
        INSERT INTO boardgame_details (
            item_id,
            genre,
            min_players,
            max_players,
            recommended_age,
            playtime
        )
        VALUES (?,?,?,?,?,?)
        `,
        [
            itemId,
            genre,
            minPlayers,
            maxPlayers,
            recommendedAge,
            playtime
        ]
    );

    return result;
};

//! Get boardgame by ID
export const getBoardgameByItemId = async (
    itemId: string
) => {

    const [rows] = await pool.query<RowDataPacket[]>(
        `
        SELECT
            item_id,
            genre,
            min_players,
            max_players,
            recommended_age,
            playtime
        FROM boardgame_details    
        WHERE item_id = ?
        `,
        [itemId]
    );

    return rows;
};    
