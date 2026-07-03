import { pool } from "../db/connections";
import { ResultSetHeader, RowDataPacket } from "mysql2";

export const createMessage = async (
    offerId: number | null,
    senderId: number,
    receiverId: number,
    content: string
) => {

    const [result] = await pool.query<ResultSetHeader>(
        `
        INSERT INTO messages (
            offer_id,
            sender_id,
            receiver_id,
            content
        )
        VALUES (?, ?, ?, ?)
        `,
        [
            offerId,
            senderId,
            receiverId,
            content
        ]
    );

    return result.insertId;
};

export const getMessagesBetweenUsers = async (
    userId: number,
    otherUserId: number
) => {

    const [rows] = await pool.query<RowDataPacket[]>(
        `
        SELECT
            messages.id,
            messages.offer_id,
            messages.sender_id,
            users.username AS sender_name,
            messages.receiver_id,
            messages.content,
            messages.is_read,
            messages.created_at
        FROM messages

        INNER JOIN users
            ON messages.sender_id = users.id

        WHERE
            (
                messages.sender_id = ?
                AND messages.receiver_id = ?
            )
            OR
            (
                messages.sender_id = ?
                AND messages.receiver_id = ?
            )

        ORDER BY messages.created_at ASC
        `,
        [
            userId,
            otherUserId,
            otherUserId,
            userId
        ]
    );

    return rows;
};

export const markMessagesAsRead = async (
    senderId: number,
    receiverId: number
) => {

    await pool.query(
        `
        UPDATE messages
        SET is_read = TRUE
        WHERE offer_id = ?
        AND receiver_id = ?
        AND is_read = FALSE
        `,
        [
            senderId,
            receiverId
        ]
    );
};

export const getUnreadMessagesCount = async (
    userId: number
) => {

    const [rows] = await pool.query<RowDataPacket[]>(
        `
    SELECT COUNT(*) AS unread_count
    FROM messages
    WHERE receiver_id = ?
    AND is_read = FALSE
    `,
        [userId]
    );

    return rows[0].unread_count;
};
