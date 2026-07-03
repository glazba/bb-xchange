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
        WHERE sender_id = ?
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

export const getConversations = async (
    userId: number
) => {

    const [rows] = await pool.query<RowDataPacket[]>(
        `
        SELECT 
            users.id AS user_id,
            users.username,
            users.avatar,
            messages.content AS last_message,
            messages.created_at AS last_message_at,
            (
                SELECT COUNT(*)
                FROM messages unread
                WHERE unread.sender_id = users.id
                AND unread.receiver_id = ?
                AND unread.is_read = FALSE
            ) AS unread_count
        
        FROM messages

        INNER JOIN users
            ON users.id =
                CASE
                    WHEN messages.sender_id = ?
                        THEN messages.receiver_id
                    ELSE messages.sender_id
                END

        INNER JOIN (
            SELECT
                CASE
                    WHEN sender_id = ? THEN receiver_id
                    ELSE sender_id
                END AS other_user_id,
                MAX(created_at) AS latest_message
            FROM messages
            WHERE sender_id = ?
            OR receiver_id = ?
            GROUP BY other_user_id
        ) latest
            ON latest.other_user_id = users.id
            AND latest.latest_message = messages.created_at
        
        WHERE messages.sender_id = ?
        OR messages.receiver_id = ?

        ORDER BY messages.created_at DESC
        `,
        [
            userId,
            userId,
            userId,
            userId,
            userId,
            userId,
            userId
        ]
    );

    return rows;
};
