import { pool } from "../db/connections";
import { ResultSetHeader, RowDataPacket } from "mysql2";

//! Create book details
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

//! Get book by ID
export const getBookByItemId = async (
    itemId: number
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

export const updateBookDetails = async (
    itemId: number,
    author: string,
    genre: string,
    pageCount: number | null,
    publishedYear: number | null,
    isbn: string | null
) => {

    const [result] = await pool.query<ResultSetHeader>(
        `
        UPDATE book_details
        SET
            author = ?,
            genre = ?,
            page_count = ?,
            published_year = ?,
            isbn = ?
        WHERE item_id = ?
        `,
        [
            author,
            genre,
            pageCount,
            publishedYear,
            isbn,
            itemId
        ]
    );

    return result;
}