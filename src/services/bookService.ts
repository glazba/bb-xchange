import { pool } from "../db/connections";
import { ResultSetHeader, RowDataPacket } from "mysql2";

export const createBookDetails = async (
    itemId: number,
    author: string,
    genre: string,
    pageCount: number | null,
    publishedYear: number | null,
    isbn: string | null
) => {

    const [result] = await pool.query<ResultSetHeader>(
        `
        INSERT INTO book_details (
            item_id,
            author,
            genre,
            page_count,
            published_year,
            isbn
        )
        VALUES (?,?,?,?,?,?)
        `,
        [
            itemId,
            author,
            genre,
            pageCount,
            publishedYear,
            isbn
        ]
    );

    return result;
}


export const getBookByItemId = async (
    itemId: string
) => {

    const [rows] = await pool.query<RowDataPacket[]>(
        `
        SELECT
            item_id,
            author,
            genre,
            page_count,
            published_year,
            isbn
        FROM book_details
        WHERE item_id = ?
        `,
        [itemId]
    );

    return rows;
}
